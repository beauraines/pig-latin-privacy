#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const { version } = require('./package.json');
const { readStdin } = require('./utils');
const { addHeaderFooter, stripHeaderFooter, hasWrapper, hasAnyMarker } = require('./headerFooter');
const { encode, decode } = require('./pigLatin');
const { BASH_COMPLETION, ZSH_COMPLETION, FISH_COMPLETION } = require('./completion');

// Shell completion subcommand
program
  .command('completion [shell]')
  .description('Generate shell completion script (bash, zsh, or fish)')
  .action((shell) => {
    const shellName = (shell || 'bash').toLowerCase();
    switch (shellName) {
      case 'bash':
        console.log(BASH_COMPLETION);
        break;
      case 'zsh':
        console.log(ZSH_COMPLETION);
        break;
      case 'fish':
        console.log(FISH_COMPLETION);
        break;
      default:
        console.error(`Error: Unknown shell '${shellName}'. Supported shells: bash, zsh, fish`);
        process.exit(1);
    }
  });

// Main command
program
  .version(version)
  .description('Pig Latin Privacy (PLP) — PGP-style "encryption" using Pig Latin')
  .argument('[message]', 'Input message (if not provided, reads from stdin)')
  .option('-e, --encrypt', 'Encrypt (translate to Pig Latin)')
  .option('-d, --decrypt', 'Decrypt (translate from Pig Latin)')
  .option('-a, --armor', 'Create ASCII armored output (header/footer wrapper)')
  .option('--no-armor', 'Output without ASCII armor')
  .option('-o, --output <file>', 'Write output to file')
  .option('-t, --type <type>', 'Armor type label', 'plp')
  .option('-i, --input <file>', 'Read input from a file')
  .action(async (message, options) => {
    // Validate mutually exclusive flags
    if (options.encrypt && options.decrypt) {
      console.error('Error: --encrypt and --decrypt are mutually exclusive');
      process.exit(1);
    }

    let inputMessage;

    if (options.input) {
      try {
        inputMessage = fs.readFileSync(options.input, 'utf8');
      } catch (err) {
        console.error(`Error: Cannot read file '${options.input}': ${err.message}`);
        process.exit(1);
      }
    } else if (message !== undefined) {
      inputMessage = message + '\n';
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
  });

program.parse(process.argv);