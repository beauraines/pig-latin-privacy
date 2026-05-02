#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const { version } = require('./package.json');
const { readStdin } = require('./utils');
const { addHeaderFooter, stripHeaderFooter, hasWrapper, hasAnyMarker } = require('./headerFooter');
const { encode, decode } = require('./pigLatin');
const { FISH_COMPLETION } = require('./completion');

// yargs' built-in completion() handles bash/zsh; fish needs a separate handler
if (process.argv[2] === 'completion' && process.argv[3] === 'fish') {
  console.log(FISH_COMPLETION);
  process.exit(0);
}

const argv = yargs(hideBin(process.argv))
  .scriptName('plp')
  .usage('$0 [options] [message]')
  .version(version)
  .option('encrypt',  { alias: 'e', boolean: true, describe: 'Encrypt (translate to Pig Latin)' })
  .option('decrypt',  { alias: 'd', boolean: true, describe: 'Decrypt (translate from Pig Latin)' })
  .option('armor',    { alias: 'a', boolean: true, describe: 'Create ASCII armored output (header/footer wrapper)' })
  .option('no-armor', { boolean: true, describe: 'Output without ASCII armor' })
  .option('output',   { alias: 'o', string: true,  describe: 'Write output to file', nargs: 1 })
  .option('type',     { alias: 't', string: true,  describe: 'Armor type label', default: 'plp' })
  .option('input',    { alias: 'i', string: true,  describe: 'Read input from a file', nargs: 1 })
  .completion('completion', 'Generate shell completion script (bash/zsh). For fish: plp completion fish')
  .help()
  .parse();

const options = argv;

// Validate mutually exclusive flags
if (options.encrypt && options.decrypt) {
  console.error('Error: --encrypt and --decrypt are mutually exclusive');
  process.exit(1);
}

(async () => {
  let inputMessage;

  if (options.input) {
    try {
      inputMessage = fs.readFileSync(options.input, 'utf8');
    } catch (err) {
      console.error(`Error: Cannot read file '${options.input}': ${err.message}`);
      process.exit(1);
    }
  } else if (argv._[0] !== undefined) {
    inputMessage = argv._[0] + '\n';
  } else {
    inputMessage = await readStdin();
  }

  // Auto-detect mode: decrypt if input has a PLP wrapper, encrypt otherwise
  const mode = options.decrypt ? 'decrypt'
    : options.encrypt ? 'encrypt'
    : hasWrapper(inputMessage) ? 'decrypt'
    : 'encrypt';

  // Armor defaults: on for encrypt, off for decrypt
  const useArmor = options.armor !== undefined ? options.armor
    : mode === 'encrypt';

  let output;

  if (mode === 'encrypt') {
    const translated = encode(inputMessage);
    output = useArmor
      ? addHeaderFooter(translated, options.type)
      : translated;
  } else {
    // Decrypt: strip wrapper if any armor marker is present, then decode
    let body = inputMessage;
    if (hasAnyMarker(inputMessage)) {
      try {
        body = stripHeaderFooter(inputMessage);
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
    }
    output = decode(body);
  }

  if (options.output) {
    try {
      fs.writeFileSync(options.output, output);
    } catch (err) {
      console.error(`Error: Cannot write file '${options.output}': ${err.message}`);
      process.exit(1);
    }
  } else {
    process.stdout.write(output);
  }
})();
