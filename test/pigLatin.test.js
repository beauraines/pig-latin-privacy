const { encode, decode } = require('../pigLatin');

describe('pigLatin.encode', () => {
  it('translates simple words', () => {
    expect(encode('hello')).toBe('ellohay');
    expect(encode('world')).toBe('orldway');
  });

  it('translates vowel-starting words', () => {
    expect(encode('apple')).toBe('appleyay');
    expect(encode('egg')).toBe('eggyay');
    expect(encode('umbrella')).toBe('umbrellayay');
  });

  it('translates multi-word phrases', () => {
    expect(encode('Hello World')).toBe('Ellohay Orldway');
    expect(encode('This is a secret message')).toBe('Isthay isyay ayay ecretsay essagemay');
  });

  it('preserves capitalization', () => {
    expect(encode('Hello')).toBe('Ellohay');
    expect(encode('STDIN')).toBe('INSTDAY');
  });

  it('preserves punctuation', () => {
    expect(encode('Hello!')).toBe('Ellohay!');
    expect(encode('end?')).toBe('endyay?');
  });

  it('handles empty input', () => {
    expect(encode('')).toBe('');
    expect(encode(null)).toBe(null);
    expect(encode(undefined)).toBe(undefined);
  });

  it('handles multi-consonant clusters', () => {
    expect(encode('string')).toBe('ingstray');
    expect(encode('three')).toBe('eethray');
    expect(encode('school')).toBe('oolschay');
    expect(encode('street')).toBe('eetstray');
  });

  it('inserts hyphens to avoid doubled consonants', () => {
    expect(encode('test')).toBe('est-tay');
    expect(encode('church')).toBe('urch-chay');
    expect(encode('that')).toBe('at-thay');
  });
});

describe('pigLatin.decode', () => {
  it('decodes simple consonant-start words', () => {
    expect(decode('ellohay')).toBe('hello');
    expect(decode('orldway')).toBe('world');
    expect(decode('oxfay')).toBe('fox');
  });

  it('decodes multi-consonant cluster words', () => {
    expect(decode('ingstray')).toBe('string');
    expect(decode('eethray')).toBe('three');
    expect(decode('oolschay')).toBe('school');
    expect(decode('eetstray')).toBe('street');
    expect(decode('eepshay')).toBe('sheep');
    expect(decode('ellshay')).toBe('shell');
  });

  it('decodes hyphenated pig latin', () => {
    expect(decode('est-tay')).toBe('test');
    expect(decode('urch-chay')).toBe('church');
    expect(decode('at-thay')).toBe('that');
  });

  it('decodes vowel-start words with yay suffix', () => {
    expect(decode('appleyay')).toBe('apple');
    expect(decode('eggyay')).toBe('egg');
    expect(decode('umbrellayay')).toBe('umbrella');
    expect(decode('orangeyay')).toBe('orange');
  });

  it('decodes single-letter and short vowel words', () => {
    expect(decode('Iyay')).toBe('I');
    expect(decode('ayay')).toBe('a');
    expect(decode('isyay')).toBe('is');
    expect(decode('ityay')).toBe('it');
    expect(decode('atyay')).toBe('at');
    expect(decode('inyay')).toBe('in');
  });

  it('preserves capitalization', () => {
    expect(decode('Ellohay')).toBe('Hello');
    expect(decode('Isthay')).toBe('This');
    expect(decode('Ethay')).toBe('The');
  });

  it('preserves ALL CAPS', () => {
    expect(decode('INSTDAY')).toBe('STDIN');
  });

  it('preserves punctuation', () => {
    expect(decode('Ellohay!')).toBe('Hello!');
    expect(decode('ogday.')).toBe('dog.');
    expect(decode('at-thay?')).toBe('that?');
  });

  it('decodes multi-word sentences', () => {
    expect(decode('Ellohay Orldway')).toBe('Hello World');
    expect(decode('Isthay isyay ayay ecretsay essagemay')).toBe('This is a secret message');
    expect(decode('Ethay uickqay ownbray oxfay umpsjay overyay ethay azylay ogday.'))
      .toBe('The quick brown fox jumps over the lazy dog.');
  });

  it('handles empty input', () => {
    expect(decode('')).toBe('');
    expect(decode(null)).toBe(null);
    expect(decode(undefined)).toBe(undefined);
  });

  it('passes through non-pig-latin words unchanged', () => {
    expect(decode('hello')).toBe('hello');
    expect(decode('42')).toBe('42');
  });

  it('handles words with consonant-initial play/day/say patterns', () => {
    expect(decode('ayplay')).toBe('play');
    expect(decode('ayday')).toBe('day');
    expect(decode('aybay')).toBe('bay');
    expect(decode('aysay')).toBe('say');
    expect(decode('ayway')).toBe('way');
  });
});

describe('pigLatin round-trip (encode then decode)', () => {
  const roundTripWords = [
    'Hello', 'World', 'the', 'quick', 'brown', 'fox', 'jumps',
    'over', 'lazy', 'dog', 'This', 'is', 'a', 'secret', 'message',
    'test', 'church', 'that', 'string', 'three', 'school', 'street',
    'sheep', 'shell', 'apple', 'egg', 'umbrella', 'I', 'play', 'day',
    'STDIN', 'it', 'at', 'in', 'on',
  ];

  it.each(roundTripWords)('round-trips "%s"', (word) => {
    expect(decode(encode(word))).toBe(word);
  });

  it('round-trips full sentences', () => {
    const sentence = 'The quick brown fox jumps over the lazy dog.';
    expect(decode(encode(sentence))).toBe(sentence);
  });

  it('round-trips a paragraph', () => {
    const text = 'Hello World! This is a test. Can it handle multiple sentences?';
    expect(decode(encode(text))).toBe(text);
  });
});

describe('pigLatin.decode known limitations', () => {
  // Vowel-starting words ending in "y" are ambiguous in pig latin.
  // The decoder may strip the trailing "y" because it cannot distinguish
  // between "army" + "ay" and "arm" + "yay".
  it.each(['army', 'easy', 'only', 'every', 'any'])('cannot reliably round-trip vowel words ending in y: "%s"', (word) => {
      const encoded = encode(word);
      const decoded = decode(encoded);
      // The decoded result is either the original or the word without trailing 'y'
      expect([word, word.slice(0, -1)]).toContain(decoded);
    });
});
