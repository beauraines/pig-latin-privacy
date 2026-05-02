const PigLatin = require('pig-latinizer').default;

const pigLatinizer = new PigLatin();

// Valid English word-initial consonant clusters (onsets), plus common
// abbreviation clusters. "y" and "dw" are excluded as single/double onsets
// because they cause too many false matches (see decode limitations below).
const VALID_ONSETS = new Set([
  // triple
  'str', 'spr', 'spl', 'scr', 'shr', 'squ', 'thr', 'sch', 'chr', 'phr',
  'std', // common in abbreviations (e.g., STDIN)
  // double
  'bl', 'br', 'ch', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gn', 'gr',
  'kn', 'ph', 'pl', 'pr', 'ps', 'qu', 'sc', 'sh', 'sk', 'sl', 'sm', 'sn',
  'sp', 'sq', 'st', 'sw', 'th', 'tr', 'tw', 'wh', 'wr',
  // single (excluding 'y' — causes ambiguity with vowel-word "yay" suffix)
  'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r',
  's', 't', 'v', 'w', 'x', 'z'
]);

const VOWELS = 'aeiou';

function encode(text) {
  return pigLatinizer.translate(text);
}

/**
 * Verify a decode candidate by re-encoding and comparing to the original.
 */
function verifyDecode(candidate, originalLower) {
  return pigLatinizer.translate(candidate).toLowerCase() === originalLower;
}

/**
 * Decode a single pig latin word token (alphabetic characters only,
 * possibly with a hyphen from pig-latinizer encoding).
 */
function decodeToken(token) {
  if (token.length < 3) return token;

  const isAllCaps = token === token.toUpperCase() && token.length > 1;
  const isCapitalized = !isAllCaps && token[0] === token[0].toUpperCase();
  const working = token.toLowerCase();

  if (!working.endsWith('ay')) return token;

  let decoded = null;

  // Phase 0: Handle hyphenated pig latin (e.g., "est-tay" → "test")
  const hyphenIdx = working.lastIndexOf('-');
  if (hyphenIdx > 0) {
    const beforeHyphen = working.slice(0, hyphenIdx);
    const afterHyphen = working.slice(hyphenIdx + 1, -2);
    if (afterHyphen.length > 0) {
      const candidate = afterHyphen + beforeHyphen;
      if (verifyDecode(candidate, working)) {
        decoded = candidate;
      }
    }
  }

  if (!decoded) {
    const stripped = working.slice(0, -2); // remove "ay"
    if (stripped.length === 0) return token;

    // Phase 1: Try valid onset matching (longest first, verified)
    for (let len = Math.min(3, stripped.length - 1); len >= 1; len--) {
      const possibleOnset = stripped.slice(-len);
      const rest = stripped.slice(0, -len);
      if (rest.length > 0 && VOWELS.includes(rest[0]) && VALID_ONSETS.has(possibleOnset)) {
        const candidate = possibleOnset + rest;
        if (verifyDecode(candidate, working)) {
          decoded = candidate;
          break;
        }
      }
    }

    // Phase 2: Try vowel-word interpretations
    if (!decoded) {
      // "yay" suffix: vowel word not ending in 'y' (e.g., "apple" → "appleyay")
      if (working.endsWith('yay') && stripped.length > 1) {
        const candidate = stripped.slice(0, -1);
        if (candidate.length > 0 && VOWELS.includes(candidate[0]) && verifyDecode(candidate, working)) {
          decoded = candidate;
        }
      }
      // "ay" suffix: vowel word ending in 'y' (e.g., "army" → "armyay")
      if (!decoded && VOWELS.includes(stripped[0]) && verifyDecode(stripped, working)) {
        decoded = stripped;
      }
    }
  }

  if (!decoded) return token;

  // Restore casing
  if (isAllCaps) {
    decoded = decoded.toUpperCase();
  } else if (isCapitalized) {
    decoded = decoded[0].toUpperCase() + decoded.slice(1);
  }

  return decoded;
}

/**
 * Decode pig latin text back to English (best-effort).
 *
 * Known limitations:
 * - Words starting with "y" (yes, you, yellow) may decode incorrectly
 * - Some vowel words ending in "y" (army, any) may lose trailing "y"
 * - Apostrophes in contractions are lost during encoding and cannot be restored
 */
function decode(text) {
  if (!text) return text;

  // Replace word tokens (possibly hyphenated) in-place, preserving
  // all whitespace, punctuation, and other non-alpha characters.
  return text.replace(/[a-zA-Z]+(?:-[a-zA-Z]+)*/g, decodeToken);
}

module.exports = { encode, decode, decodeToken };
