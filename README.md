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
# Encrypt a message (with ASCII armor)
plp "Hello World"

# Encrypt with explicit armor flag (like gpg -e -a)
plp -e -a "Hello World"

# Encrypt without armor
plp --no-armor "Hello World"

# Encrypt from stdin
echo "This is a secret message" | plp

# Encrypt from a file
plp -i message.txt

# Encrypt to an output file
plp -o encrypted.txt "Hello World"
```

**Decrypt:**

```bash
# Decrypt a wrapped message (auto-detected)
plp -i encrypted.txt

# Decrypt with explicit flag
plp -d -i encrypted.txt

# Decrypt from stdin
echo "Ellohay Orldway" | plp -d

# Decrypt to an output file
plp -d -o decrypted.txt -i encrypted.txt

# Round-trip: encrypt then decrypt
plp "Hello World" | plp -d
```

**Options:**

| Flag | Description |
|------|-------------|
| `-e, --encrypt` | Encrypt (translate to Pig Latin) — this is the default |
| `-d, --decrypt` | Decrypt (translate from Pig Latin back to English) |
| `-a, --armor` | Create ASCII armored output (header/footer) — on by default for encrypt |
| `--no-armor` | Omit the ASCII armor |
| `-o, --output <file>` | Write output to a file |
| `-t, --type <type>` | Armor type label (default: `plp`) |
| `-i, --input <file>` | Read input from a file instead of args/stdin |

When no mode is specified, PLP auto-detects: if input contains a PLP armor wrapper, it decrypts; otherwise it encrypts.

### Shell Completion

PLP supports tab completion powered by [yargs](https://yargs.js.org/) built-in completion for bash/zsh, and a static script for fish.

**Bash:**
```bash
# Add to ~/.bashrc for permanent completion
eval "$(plp completion)"

# Or install system-wide
plp completion > /etc/bash_completion.d/plp
```

**Zsh:**
```zsh
# Add to ~/.zshrc for permanent completion
eval "$(plp completion)"
```

**Fish:**
```fish
# Install to fish completions directory
plp completion fish > ~/.config/fish/completions/plp.fish
```

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