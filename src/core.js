/**
 * International Morse Code map. Dot = '.', dash = '-'.
 *
 * WHY dot/dash rather than audio units: keeping the alphabet in pure ASCII lets
 * consumers choose their own signalling medium (LED, sound, printed text) by
 * replacing '.' and '-' downstream. Encoding to a medium-independent form is the
 * smallest useful job this library can do.
 */
export const MORSE_TABLE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
  '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.'
};

/** Reverse lookup, built once at module load so decode stays O(n) per symbol. */
export const REVERSE_TABLE = (() => {
  const r = Object.create(null);
  for (const [ch, seq] of Object.entries(MORSE_TABLE)) r[seq] = ch;
  return r;
})();

/**
 * HOW encoders and decoders agree on spacing:
 *  - one space between words in plain text  -> '/' in Morse text
 *  - one space between letters in plain text -> single space in Morse text
 *  - dots/dashes within a letter             -> no spaces
 *
 * WHY not require seven-space word gaps: the '/' convention is the most common
 * text representation and keeps round-tripping lossless for the characters we
 * support. Picking one convention (and stating it) is safer than guessing.
 */

/**
 * Encode plain text into Morse Code text.
 *
 * Letters are uppercased before lookup so the caller can pass either case.
 * Characters with no Morse mapping are dropped; they would only produce
 * confusing gaps in the output.
 *
 * @param {string} text - Plain text to encode.
 * @returns {string} Space-separated Morse sequences, words separated by '/'.
 */
export function encode(text) {
  if (typeof text !== 'string' || text.length === 0) return '';
  const words = text.split(/\s+/);
  const out = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w.length === 0) continue;
    const codes = [];
    for (let j = 0; j < w.length; j++) {
      const ch = w[j].toUpperCase();
      if (MORSE_TABLE[ch] !== undefined) codes.push(MORSE_TABLE[ch]);
    }
    if (codes.length > 0) out.push(codes.join(' '));
  }
  return out.join(' / ');
}

/**
 * Decode Morse Code text back into plain text.
 *
 * '/' separates words (output joined by single space). Single spaces inside a
 * word group separate letters. Unknown sequences are dropped rather than
 * producing placeholder characters, which keeps output clean for valid input.
 *
 * @param {string} morse - Morse text, sequences separated by single spaces, words by '/'.
 * @returns {string} Decoded plain text, uppercase.
 */
export function decode(morse) {
  if (typeof morse !== 'string' || morse.length === 0) return '';
  const words = morse.trim().split(/\s*\/\s*/);
  const out = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i].trim();
    if (w.length === 0) continue;
    const seqs = w.split(/\s+/);
    const chars = [];
    for (let j = 0; j < seqs.length; j++) {
      const seq = seqs[j];
      if (seq.length === 0) continue;
      const ch = REVERSE_TABLE[seq];
      if (ch !== undefined) chars.push(ch);
    }
    if (chars.length > 0) out.push(chars.join(''));
  }
  return out.join(' ');
}
