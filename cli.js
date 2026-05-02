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
  .option('-a, --armor', 'Create ASCII armored output (header/footer wrapper)')
  .option('--no-armor', 'Output without ASCII armor')
  .option('-o, --output <file>', 'Write output to file')
  .option('-t, --type <type>', 'Armor type label', 'plp')
  .option('-i, --input <file>', 'Read input from a file')
  .parse(process.argv);

const options = program.opts();

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
  } else if (program.args[0] !== undefined) {
    inputMessage = program.args[0] + '\n';
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