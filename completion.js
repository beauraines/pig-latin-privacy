/**
 * Fish shell completion script for the plp CLI.
 * Bash and zsh completions are generated automatically via yargs: plp completion
 */

const FISH_COMPLETION = `###-begin-plp-completion-###
# fish completion for plp
# To enable: write to the fish completions directory:
#   plp completion fish > ~/.config/fish/completions/plp.fish

complete -c plp -s e -l encrypt -d 'Encrypt (translate to Pig Latin)'
complete -c plp -s d -l decrypt -d 'Decrypt (translate from Pig Latin)'
complete -c plp -s a -l armor -d 'Create ASCII armored output (header/footer wrapper)'
complete -c plp -l no-armor -d 'Output without ASCII armor'
complete -c plp -s o -l output -d 'Write output to file' -r -F
complete -c plp -s t -l type -d 'Armor type label' -r -a 'plp pgp'
complete -c plp -s i -l input -d 'Read input from a file' -r -F
###-end-plp-completion-###`;

module.exports = { FISH_COMPLETION };
