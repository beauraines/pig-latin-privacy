/**
 * Shell completion scripts for the plp CLI.
 * Supports bash, zsh, and fish.
 */

const BASH_COMPLETION = `###-begin-plp-completion-###
# bash completion for plp
# To enable: add the following line to your ~/.bashrc
#   eval "$(plp completion bash)"
# Or write to the completions directory:
#   plp completion bash > /etc/bash_completion.d/plp

_plp_completion() {
    local cur prev opts
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    prev="\${COMP_WORDS[COMP_CWORD-1]}"
    opts="-e --encrypt -d --decrypt -a --armor --no-armor -o --output -t --type -i --input -V --version -h --help completion"

    case "\${prev}" in
        -o|--output|-i|--input)
            COMPREPLY=( $(compgen -f -- "\${cur}") )
            return 0
            ;;
        -t|--type)
            COMPREPLY=( $(compgen -W "plp pgp" -- "\${cur}") )
            return 0
            ;;
        completion)
            COMPREPLY=( $(compgen -W "bash zsh fish" -- "\${cur}") )
            return 0
            ;;
    esac

    COMPREPLY=( $(compgen -W "\${opts}" -- "\${cur}") )
    return 0
}

complete -F _plp_completion plp
###-end-plp-completion-###`;

const ZSH_COMPLETION = `###-begin-plp-completion-###
# zsh completion for plp
# To enable: add the following line to your ~/.zshrc
#   eval "$(plp completion zsh)"
# Or write to a $fpath directory:
#   plp completion zsh > "\${fpath[1]}/_plp"

_plp() {
    _arguments -s \\
        '(-e --encrypt)'{-e,--encrypt}'[Encrypt (translate to Pig Latin)]' \\
        '(-d --decrypt)'{-d,--decrypt}'[Decrypt (translate from Pig Latin)]' \\
        '(-a --armor)'{-a,--armor}'[Create ASCII armored output (header/footer wrapper)]' \\
        '--no-armor[Output without ASCII armor]' \\
        '(-o --output)'{-o,--output}'[Write output to file]:output file:_files' \\
        '(-t --type)'{-t,--type}'[Armor type label]:type:(plp pgp)' \\
        '(-i --input)'{-i,--input}'[Read input from a file]:input file:_files' \\
        '(-V --version)'{-V,--version}'[Output the version number]' \\
        '(-h --help)'{-h,--help}'[Display help for command]' \\
        ':message:' \\
        '::shell:(bash zsh fish)'
}

compdef _plp plp
###-end-plp-completion-###`;

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
complete -c plp -f -n '__fish_use_subcommand' -a completion -d 'Generate shell completion script'
###-end-plp-completion-###`;

module.exports = { BASH_COMPLETION, ZSH_COMPLETION, FISH_COMPLETION };
