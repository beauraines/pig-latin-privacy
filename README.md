Pig Latin Privacy
=================

Project Description
--------------------

Pig Latin Privacy (PLP) is a joke command-line tool modeled after PGP. Instead of real encryption, it "encrypts" and "decrypts" messages using Pig Latin translation. Output includes PGP-style ASCII armor headers and footers.

Installation and Usage
----------------------

### Installation

```bash
npm install
npm link   # optional: makes 'plp' available globally
```

### Usage

**Encrypt (default):**

```bash
# Encrypt a message (with wrapper)
plp "Hello World"

# Encrypt without the wrapper
plp --no-wrapper "Hello World"

# Encrypt from stdin
echo "This is a secret message" | plp

# Encrypt from a file
plp -i message.txt
```

**Decrypt:**

```bash
# Decrypt a wrapped message
plp -d -i encrypted.txt

# Decrypt from stdin
echo "Ellohay Orldway" | plp -d

# Round-trip: encrypt then decrypt
plp "Hello World" | plp -d
```

**Options:**

| Flag | Description |
|------|-------------|
| `-e, --encrypt` | Encrypt (translate to Pig Latin) — this is the default |
| `-d, --decrypt` | Decrypt (translate from Pig Latin back to English) |
| `--no-wrapper` | Omit the PLP header and footer |
| `-t, --type <type>` | Wrapper type label (default: `plp`) |
| `-i, --input <file>` | Read input from a file instead of args/stdin |

### Example Output

```
-----BEGIN PLP MESSAGE-----
Isthay isyay ayay ecretsay essagemay

-----END PLP MESSAGE-----
```

### Known Limitations

Pig Latin is inherently ambiguous when reversing — some words cannot be perfectly round-tripped:

- Words starting with "y" (yes, you, yellow) may decode incorrectly
- Vowel-starting words ending in "y" (army, easy, every) may lose their trailing "y"
- Apostrophes in contractions are lost during encoding

Development
-----------

1. Run tests: `npm test`
2. Node.js and npm required

### Contributing

1. Clone: `git clone https://github.com/beauraines/pig-latin-privacy.git`
2. Install: `npm install`
3. Run tests: `npm test`
4. PRs welcome!

License and Credits
---------------------

This project is licensed under the ISC license.

*Commander.js and PigLatinizer are used under their respective licenses.*