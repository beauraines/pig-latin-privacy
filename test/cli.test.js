const { addHeaderFooter } = require('../headerFooter');

describe('addHeaderFooter', () => {
  test('wraps message with default PLP header and footer', () => {
    const result = addHeaderFooter('test message');
    expect(result).toBe('-----BEGIN PLP MESSAGE-----\ntest message\n-----END PLP MESSAGE-----\n');
  });

  test('wraps message with custom type header and footer', () => {
    const result = addHeaderFooter('test message', 'gpg');
    expect(result).toBe('-----BEGIN GPG MESSAGE-----\ntest message\n-----END GPG MESSAGE-----\n');
  });

  test('uppercases the type in header and footer', () => {
    const result = addHeaderFooter('hello', 'abc');
    expect(result).toContain('-----BEGIN ABC MESSAGE-----');
    expect(result).toContain('-----END ABC MESSAGE-----');
  });

  test('preserves the message content', () => {
    const msg = 'ellohay orldway';
    const result = addHeaderFooter(msg);
    expect(result).toContain(msg);
  });
});
