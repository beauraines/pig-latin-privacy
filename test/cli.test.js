const { execSync } = require('child_process');

describe('CLI Pig Latin Translator', () => {
  it('should translate a single message', () => {
    const output = execSync('node cli.js "Hello World"').toString();
    expect(output).toContain('Ellohay Orldway');
  });

  it('should format output with wrapper', () => {
    const output = execSync('node cli.js --wrapper "This is a secret message"').toString();
    expect(output).toContain('-----BEGIN PLP MESSAGE-----');
    expect(output).toContain('Isthay isyay ayay ecretsay essagemay');
    expect(output).toContain('-----END PLP MESSAGE-----');
  });

  it('should exclude the wrapper', () => {
    const output = execSync('node cli.js --no-wrapper "Hello World"').toString();
    expect(output).toContain('Ellohay Orldway');
    expect(output).not.toContain('-----BEGIN PLP MESSAGE-----');
  });
  
  it('should handle input from STDIN', () => {
    const output = execSync('echo "Hello STDIN" | node cli.js').toString();
    expect(output).toContain('Ellohay TDINsway');
  });
});
