#!/usr/bin/env node

const { program } = require('commander');
const { readStdin } = require('./utils');
const { addHeaderFooter } = require('./headerFooter');
const PigLatin = require('pig-latinizer').default;

const pigLatin = new PigLatin();
pigLatin.exclusions.push("woot");

// Setup CLI options
program
  .version('1.0.0')
  .argument('[message]', 'Input message (if not provided, reads from stdin)')
  .option('--no-wrapper', 'Output message without header and footer')
  .option('-t, --type <type>', 'Type of message processing (e.g., "plp")', 'plp')
  .option('--encode', 'Force encoding (pig latin); default is true, so this is optional')
  // Optionally, in future:
  // .option('--no-encode', 'Disable encoding')
  .parse(process.argv);

// For now, always encode by default
const encode = true;

const options = program.opts();
const msgArg = program.args[0];

(async () => {
  let inputMessage;
  if (msgArg !== undefined) {
    inputMessage = msgArg + '\n';
  } else {
    inputMessage = await readStdin();
  }

  if (encode) {
    inputMessage = pigLatin.translate(inputMessage);
  }

  let output;
  if (options.wrapper) {
    output = addHeaderFooter(inputMessage, options.type);
  } else {
    output = inputMessage;
  }

  process.stdout.write(output);
})();