const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLI = 'node cli.js';

describe('CLI encrypt', () => {
  it('encrypts a message with wrapper by default', () => {
    const output = execSync(`${CLI} "Hello World"`).toString();
    expect(output).toContain('-----BEGIN PLP MESSAGE-----');
    expect(output).toContain('Ellohay Orldway');
    expect(output).toContain('-----END PLP MESSAGE-----');
  });

  it('encrypts without wrapper using --no-wrapper', () => {
    const output = execSync(`${CLI} --no-wrapper "Hello World"`).toString();
    expect(output).toContain('Ellohay Orldway');
    expect(output).not.toContain('-----BEGIN PLP MESSAGE-----');
  });

  it('encrypts from stdin', () => {
    const output = execSync(`echo "Hello World" | ${CLI} --no-wrapper`).toString();
    expect(output).toContain('Ellohay Orldway');
  });

  it('encrypts a full sentence from stdin', () => {
    const output = execSync(`echo "The quick brown fox jumps over the lazy dog." | ${CLI} --no-wrapper`).toString();
    expect(output).toContain('Ethay uickqay ownbray oxfay umpsjay overyay ethay azylay ogday.');
  });

  it('uses custom wrapper type with -t', () => {
    const output = execSync(`${CLI} -t secret "Hello"`).toString();
    expect(output).toContain('-----BEGIN SECRET MESSAGE-----');
    expect(output).toContain('-----END SECRET MESSAGE-----');
  });

  it('encrypts from a file with -i', () => {
    const tmpFile = path.join(__dirname, '.tmp-test-input.txt');
    fs.writeFileSync(tmpFile, 'Hello World');
    try {
      const output = execSync(`${CLI} --no-wrapper -i ${tmpFile}`).toString();
      expect(output).toContain('Ellohay Orldway');
    } finally {
      fs.unlinkSync(tmpFile);
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

  it('round-trips a sentence through encrypt then decrypt', () => {
    const original = 'The quick brown fox jumps over the lazy dog.';
    const output = execSync(`echo "${original}" | ${CLI} --no-wrapper | ${CLI} -d`).toString();
    expect(output.trim()).toBe(original);
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
});