const PigLatin = require('pig-latinizer').default;

const pigLatin = new PigLatin();
pigLatin.exclusions.push('woot');

describe('Pig Latin translation', () => {
  test('translates a simple word', () => {
    expect(pigLatin.translate('hello')).toBe('ellohay');
  });

  test('translates a sentence', () => {
    expect(pigLatin.translate('hello world')).toBe('ellohay orldway');
  });

  test('leaves excluded word "woot" untranslated', () => {
    expect(pigLatin.translate('woot')).toBe('woot');
  });

  test('translates a word starting with a vowel', () => {
    expect(pigLatin.translate('apple')).toBe('appleyay');
  });

  test('returns empty string for empty input', () => {
    expect(pigLatin.translate('')).toBe('');
  });
});
