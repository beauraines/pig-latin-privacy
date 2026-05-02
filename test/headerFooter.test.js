const { addHeaderFooter, stripHeaderFooter, hasWrapper } = require('../headerFooter');

describe('addHeaderFooter', () => {
  it('adds PLP header and footer by default', () => {
    const result = addHeaderFooter('Ellohay Orldway');
    expect(result).toBe('-----BEGIN PLP MESSAGE-----\nEllohay Orldway\n-----END PLP MESSAGE-----\n');
  });

  it('uses custom type label', () => {
    const result = addHeaderFooter('test', 'secret');
    expect(result).toContain('-----BEGIN SECRET MESSAGE-----');
    expect(result).toContain('-----END SECRET MESSAGE-----');
  });

  it('uses multi-word type label', () => {
    const result = addHeaderFooter('test', 'top secret');
    expect(result).toContain('-----BEGIN TOP SECRET MESSAGE-----');
    expect(result).toContain('-----END TOP SECRET MESSAGE-----');
  });

  it('uppercases the type label', () => {
    const result = addHeaderFooter('test', 'plp');
    expect(result).toContain('BEGIN PLP MESSAGE');
  });
});

describe('stripHeaderFooter', () => {
  it('strips header and footer returning the body', () => {
    const wrapped = '-----BEGIN PLP MESSAGE-----\nEllohay Orldway\n-----END PLP MESSAGE-----\n';
    expect(stripHeaderFooter(wrapped)).toBe('Ellohay Orldway');
  });

  it('handles multi-line body', () => {
    const wrapped = '-----BEGIN PLP MESSAGE-----\nline one\nline two\nline three\n-----END PLP MESSAGE-----\n';
    expect(stripHeaderFooter(wrapped)).toBe('line one\nline two\nline three');
  });

  it('throws on missing header', () => {
    expect(() => stripHeaderFooter('just some text\n-----END PLP MESSAGE-----\n'))
      .toThrow('Invalid message format');
  });

  it('throws on missing footer', () => {
    expect(() => stripHeaderFooter('-----BEGIN PLP MESSAGE-----\njust some text'))
      .toThrow('Invalid message format');
  });

  it('throws on empty input', () => {
    expect(() => stripHeaderFooter('')).toThrow('Invalid message format');
  });

  it('throws on mismatched BEGIN/END labels', () => {
    const wrapped = '-----BEGIN SECRET MESSAGE-----\ntest body\n-----END PLP MESSAGE-----\n';
    expect(() => stripHeaderFooter(wrapped)).toThrow('Invalid message format');
  });

  it('strips multi-word type label', () => {
    const wrapped = '-----BEGIN TOP SECRET MESSAGE-----\ntest body\n-----END TOP SECRET MESSAGE-----\n';
    expect(stripHeaderFooter(wrapped)).toBe('test body');
  });
});

describe('hasWrapper', () => {
  it('returns true for wrapped messages', () => {
    const wrapped = '-----BEGIN PLP MESSAGE-----\ntest\n-----END PLP MESSAGE-----\n';
    expect(hasWrapper(wrapped)).toBe(true);
  });

  it('returns false for unwrapped messages', () => {
    expect(hasWrapper('just plain text')).toBe(false);
  });

  it('returns false for partial wrapper', () => {
    expect(hasWrapper('-----BEGIN PLP MESSAGE-----\nno footer')).toBe(false);
  });

  it('returns true for multi-word type label', () => {
    const wrapped = '-----BEGIN TOP SECRET MESSAGE-----\ntest\n-----END TOP SECRET MESSAGE-----\n';
    expect(hasWrapper(wrapped)).toBe(true);
  });
});
