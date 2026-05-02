const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLI = 'node cli.js';

describe('CLI encrypt', () => {
  it('encrypts a message with armor by default', () => {
    const output = execSync(`${CLI} "Hello World"`).toString();
    expect(output).toContain('-----BEGIN PLP MESSAGE-----');
    expect(output).toContain('Ellohay Orldway');
    expect(output).toContain('-----END PLP MESSAGE-----');
  });

  it('encrypts without armor using --no-armor', () => {
    const output = execSync(`${CLI} --no-armor "Hello World"`).toString();
    expect(output).toContain('Ellohay Orldway');
    expect(output).not.toContain('-----BEGIN PLP MESSAGE-----');
  });

  it('supports -a flag for explicit armor', () => {
    const output = execSync(`${CLI} -a "Hello World"`).toString();
    expect(output).toContain('-----BEGIN PLP MESSAGE-----');
  });

  it('encrypts from stdin', () => {
    const output = execSync(`echo "Hello World" | ${CLI} --no-armor`).toString();
    expect(output).toContain('Ellohay Orldway');
  });

  it('encrypts a full sentence from stdin', () => {
    const output = execSync(`echo "The quick brown fox jumps over the lazy dog." | ${CLI} --no-armor`).toString();
    expect(output).toContain('Ethay uickqay ownbray oxfay umpsjay overyay ethay azylay ogday.');
  });

  it('uses custom armor type with -t', () => {
    const output = execSync(`${CLI} -t secret "Hello"`).toString();
    expect(output).toContain('-----BEGIN SECRET MESSAGE-----');
    expect(output).toContain('-----END SECRET MESSAGE-----');
  });

  it('encrypts from a file with -i', () => {
    const tmpFile = path.join(__dirname, '.tmp-test-input.txt');
    fs.writeFileSync(tmpFile, 'Hello World');
    try {
      const output = execSync(`${CLI} --no-armor -i ${tmpFile}`).toString();
      expect(output).toContain('Ellohay Orldway');
    } finally {
      fs.unlinkSync(tmpFile);
    }
  });

  it('writes output to a file with -o', () => {
    const tmpFile = path.join(__dirname, '.tmp-test-output.txt');
    try {
      execSync(`${CLI} --no-armor -o ${tmpFile} "Hello World"`);
      const content = fs.readFileSync(tmpFile, 'utf8');
      expect(content).toContain('Ellohay Orldway');
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });
});

describe('CLI decrypt', () => {
  it('decrypts a wrapped message from stdin', () => {
    const output = execSync(`${CLI} "Hello World" | ${CLI} -d`).toString();
    expect(output.trim()).toBe('Hello World');
  });

  it('decrypts an unwrapped message', () => {
    const output = execSync(`echo "Ellohay Orldway" | ${CLI} -d`).toString();
    expect(output.trim()).toBe('Hello World');
  });

  it('decrypts from a file with -i', () => {
    const tmpFile = path.join(__dirname, '.tmp-test-encrypted.txt');
    const encrypted = execSync(`${CLI} "This is a test"`).toString();
    fs.writeFileSync(tmpFile, encrypted);
    try {
      const output = execSync(`${CLI} -d -i ${tmpFile}`).toString();
      expect(output.trim()).toBe('This is a test');
    } finally {
      fs.unlinkSync(tmpFile);
    }
  });

  it('writes decrypted output to a file with -o', () => {
    const outFile = path.join(__dirname, '.tmp-test-decrypt-out.txt');
    try {
      execSync(`echo "Ellohay Orldway" | ${CLI} -d -o ${outFile}`);
      const content = fs.readFileSync(outFile, 'utf8');
      expect(content.trim()).toBe('Hello World');
    } finally {
      if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
    }
  });

  it('round-trips a sentence through encrypt then decrypt', () => {
    const original = 'The quick brown fox jumps over the lazy dog.';
    const output = execSync(`echo "${original}" | ${CLI} --no-armor | ${CLI} -d`).toString();
    expect(output.trim()).toBe(original);
  });
});

describe('CLI auto-detect mode', () => {
  it('auto-decrypts when stdin contains a PLP wrapper', () => {
    const output = execSync(`${CLI} "Hello World" | ${CLI}`).toString();
    expect(output.trim()).toBe('Hello World');
  });
});

describe('CLI error handling', () => {
  it('rejects --encrypt and --decrypt together', () => {
    expect(() => {
      execSync(`${CLI} -e -d "test"`, { stdio: 'pipe' });
    }).toThrow();
  });

  it('errors on nonexistent input file', () => {
    expect(() => {
      execSync(`${CLI} -i nonexistent-file.txt`, { stdio: 'pipe' });
    }).toThrow();
  });

  it('errors on truncated armored input (missing footer) in decrypt mode', () => {
    const tmpFile = path.join(__dirname, '.tmp-test-no-footer.txt');
    fs.writeFileSync(tmpFile, '-----BEGIN PLP MESSAGE-----\nEllohay Orldway');
    try {
      expect(() => {
        execSync(`${CLI} -d -i ${tmpFile}`, { stdio: 'pipe' });
      }).toThrow();
    } finally {
      fs.unlinkSync(tmpFile);
    }
  });

  it('errors on truncated armored input (missing header) in decrypt mode', () => {
    const tmpFile = path.join(__dirname, '.tmp-test-no-header.txt');
    fs.writeFileSync(tmpFile, 'Ellohay Orldway\n-----END PLP MESSAGE-----\n');
    try {
      expect(() => {
        execSync(`${CLI} -d -i ${tmpFile}`, { stdio: 'pipe' });
      }).toThrow();
    } finally {
      fs.unlinkSync(tmpFile);
    }
  });
});
describe('CLI shell completion', () => {
  it('outputs bash completion script with "completion bash"', () => {
    const output = execSync(`${CLI} completion bash`).toString();
    expect(output).toContain('###-begin-plp-completion-###');
    expect(output).toContain('_plp_completion');
    expect(output).toContain('complete -F _plp_completion plp');
    expect(output).toContain('###-end-plp-completion-###');
  });

  it('outputs zsh completion script with "completion zsh"', () => {
    const output = execSync(`${CLI} completion zsh`).toString();
    expect(output).toContain('###-begin-plp-completion-###');
    expect(output).toContain('compdef _plp plp');
    expect(output).toContain('###-end-plp-completion-###');
  });

  it('outputs fish completion script with "completion fish"', () => {
    const output = execSync(`${CLI} completion fish`).toString();
    expect(output).toContain('###-begin-plp-completion-###');
    expect(output).toContain('complete -c plp');
    expect(output).toContain('###-end-plp-completion-###');
  });

  it('defaults to bash completion when no shell is specified', () => {
    const outputDefault = execSync(`${CLI} completion`).toString();
    const outputBash = execSync(`${CLI} completion bash`).toString();
    expect(outputDefault).toBe(outputBash);
  });

  it('errors on unsupported shell', () => {
    expect(() => {
      execSync(`${CLI} completion powershell`, { stdio: 'pipe' });
    }).toThrow();
  });

  it('bash completion script includes all CLI options', () => {
    const output = execSync(`${CLI} completion bash`).toString();
    expect(output).toContain('--encrypt');
    expect(output).toContain('--decrypt');
    expect(output).toContain('--armor');
    expect(output).toContain('--no-armor');
    expect(output).toContain('--output');
    expect(output).toContain('--type');
    expect(output).toContain('--input');
  });
});
