Pig Latin Privacy
=================

Project Description
--------------------

This project is a command-line tool written in JavaScript that takes input from either user-provided text or standard input (STDIN) and applies Pig Latin translation to it. The output includes a header and footer if the `--wrapper` option is specified, which contains the translated message with proper formatting.

Installation and Usage
----------------------

### Installation

To use this project, first install the required dependencies by running the following command:

```bash
npm install
```

### Usage

You can then run the script using the following commands:

* To translate a single input message: `node cli.js "Hello World"`
* To read from STDIN if no input is provided: `node cli.js`
* To use the `--wrapper` option for output formatting: `node cli.js --wrapper --type plp`
* To exclude the wrapper, use the `--no-wrapper` option

```
-----BEGIN PLP MESSAGE-----
Isthay isyay ayay ecretsay essagemay

-----END PLP MESSAGE-----
```

Development
-----------

To develop this project, you will need:

1. Run tests using the command: `npm test`.
2. A code editor or IDE of your choice.
2. Node.js and npm installed on your system.

Here are the steps to contribute to this project:

1. Clone the repository using Git: `git clone https://github.com/beauraines/pig-latin-privacy.git`
2. Change into the cloned directory: `cd pig-latin-privacy`
3. Install dependencies: `npm install`
4. Run the script with the desired input or STDIN to test its functionality.

License and Credits
---------------------

This project is licensed under the ISC license (see LICENSE file for details).

*Commander.js and PigLatinizer are used under their respective licenses.*

I hope this helps you create a great README.md file for your project!