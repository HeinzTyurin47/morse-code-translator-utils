import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { encode, decode, MORSE_TABLE, REVERSE_TABLE } from '../src/index.js';

describe('encode', () => {
  it('encodes a simple word', () => {
    assert.equal(encode('SOS'), '... --- ...');
  });

  it('encodes multiple words with slashes', () => {
    assert.equal(encode('HELLO WORLD'), '.... . .-.. .-.. --- / .-- --- .-. .-.. -..');
  });

  it('uppercases input before lookup', () => {
    assert.equal(encode('hello'), '.... . .-.. .-.. ---');
  });

  it('encodes digits', () => {
    assert.equal(encode('42'), '....- ..---');
  });

  it('encodes common punctuation', () => {
    assert.equal(encode('HI!'), '.... .. -.-.--');
  });

  it('drops unsupported characters', () => {
    assert.equal(encode('A[B'), '.- -...');
  });

  it('handles empty string', () => {
    assert.equal(encode(''), '');
  });

  it('collapses multiple spaces into a single word separator', () => {
    assert.equal(encode('A  B'), '.- / -...');
  });

  it('ignores leading and trailing whitespace', () => {
    assert.equal(encode('  HI  '), '.... ..');
  });
});

describe('decode', () => {
  it('decodes a simple word', () => {
    assert.equal(decode('... --- ...'), 'SOS');
  });

  it('decodes multiple words separated by slashes', () => {
    assert.equal(decode('.... . .-.. .-.. --- / .-- --- .-. .-.. -..'), 'HELLO WORLD');
  });

  it('decodes digits', () => {
    assert.equal(decode('....- ..---'), '42');
  });

  it('decodes punctuation', () => {
    assert.equal(decode('.... .. -.-.--'), 'HI!');
  });

  it('drops unknown Morse sequences', () => {
    assert.equal(decode('.- ------ -...'), 'AB');
  });

  it('handles empty string', () => {
    assert.equal(decode(''), '');
  });

  it('tolerates extra spaces around slashes', () => {
    assert.equal(decode('.-  /  -...'), 'A B');
  });

  it('ignores leading and trailing whitespace', () => {
    assert.equal(decode('  ... --- ...  '), 'SOS');
  });
});

describe('round trip', () => {
  it('round-trips a mixed-case sentence with digits and punctuation', () => {
    const text = 'Hello 123 World!';
    assert.equal(decode(encode(text)), 'HELLO 123 WORLD!');
  });
});

describe('tables', () => {
  it('MORSE_TABLE covers all 26 letters', () => {
    for (let i = 0; i < 26; i++) {
      const ch = String.fromCharCode(65 + i);
      assert.ok(MORSE_TABLE[ch] !== undefined, `letter ${ch} should be mapped`);
    }
  });

  it('REVERSE_TABLE is the inverse of MORSE_TABLE', () => {
    for (const [ch, seq] of Object.entries(MORSE_TABLE)) {
      assert.equal(REVERSE_TABLE[seq], ch);
    }
  });
});
