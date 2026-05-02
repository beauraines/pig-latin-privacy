#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const { readStdin } = require('./utils');
const { addHeaderFooter, stripHeaderFooter, hasWrapper } = require('./headerFooter');
const { encode, decode } = require('./pigLatin');

program
  .version('1.0.0')
  .description('Pig Latin Privacy (PLP) — PGP-style "encryption" using Pig Latin')
  .argument('[message]', 'Input message (if not provided, reads from stdin)')
  .option('-e, --encrypt', 'Encrypt (translate to Pig Latin)')
  .option('-d, --decrypt', 'Decrypt (translate from Pig Latin)')
  .option('--no-wrapper', 'Output message without header and footer')
  .option('-t, --type <type>', 'Wrapper type label', 'plp')
  .option('-i, --input <file>', 'Read input from a file')
  .parse(process.argv);

const options = program.opts();

// Validate mutually exclusive flags
if (options.encrypt && options.decrypt) {
  console.error('Error: --encrypt and --decrypt are mutually exclusive');
  process.exit(1);
}

// Default to encrypt if neither specified
const mode = options.decrypt ? 'decrypt' : 'encrypt';

(async () => {
  let inputMessage;

  if (options.input) {
    try {
      inputMessage = fs.readFileSync(options.input, 'utf8');
    } catch (err) {
      console.error(`Error: Cannot read file '${options.input}': ${err.message}`);
      process.exit(1);
    }
  } else if (program.args[0] !== undefined) {
    inputMessage = program.args[0] + '\n';
  } else {
    inputMessage = await readStdin();
  }

  let output;

  if (mode === 'encrypt') {
    const translated = encode(inputMessage);
    output = options.wrapper
      ? addHeaderFooter(translated, options.type)
      : translated;
  } else {
    // Decrypt: strip wrapper if present, then decode
    let body = inputMessage;
    if (hasWrapper(inputMessage)) {
      try {
        body = stripHeaderFooter(inputMessage);
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
    }
    output = decode(body);
  }

  process.stdout.write(output);
})();