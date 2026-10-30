# morse-code-translator-utils

Encodes and decodes text to and from International Morse Code using dot-dash sequences and character separators.

## Usage

```js
import { encode, decode } from 'morse-code-translator-utils';

encode('SOS');        // '... --- ...'
encode('HELLO WORLD'); // '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'
decode('... --- ...'); // 'SOS'
```

The full alphabet map is also exported as `MORSE_TABLE` (plain-text char to Morse string) and `REVERSE_TABLE` (Morse string to plain-text char) for direct lookup.

## Why

The specific problem: convert between readable text and the dot-dash representation of International Morse Code without pulling in a dependency tree. The trade-off is that this library stops at the text representation. It does not produce audio, timing pulses, or light signals — that work belongs to whatever consumer wraps it. Keeping the boundary there means zero third-party dependencies and a small surface that is easy to reason about.

## Spacing convention

One convention is fixed and tested: letters are separated by a single space, words by ` / ` (space-slash-space). Round-tripping works for the supported alphabet because ` / ` never appears inside a letter code.

## Edge cases

- Input is upper-cased before lookup, so `encode('hello')` equals `encode('HELLO')`.
- Characters without a Morse mapping (e.g. `[`, `]`) are dropped silently during encoding. Check the source of `MORSE_TABLE` for the supported set.
- Unknown Morse sequences during decoding are dropped as well; they do not become placeholder characters.

## Run the tests

```sh
node --test
```

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

