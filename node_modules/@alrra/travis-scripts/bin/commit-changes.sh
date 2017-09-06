#!/bin/bash

declare -r LOG_PREFIX='[travis-scripts]'

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

commit_and_push_changes() {

    # Check if there are unstaged changes, and
    # if there are, commit and push them upstream

    if [ "$(git status --porcelain)" != "" ]; then
        git config --global user.email ${GH_USER_EMAIL} \
            && git config --global user.name ${GH_USER_NAME} \
            && git checkout --quiet "$1" \
            && git add -A \
            && git commit --message "$2" \
            && git push --quiet "$(get_repository_url)" "$1"
    fi

}

execute() {
    eval ${1}
}

get_repository_url() {
    printf "https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git"
}

print_error() {
    print_in_red "$LOG_PREFIX [✖] $1 $2\n"
}

print_help_message() {
    printf '\n'
    printf 'OPTIONS:'
    printf '\n'
    printf '\n'
    printf ' -b, --branch <branch_name>\n'
    printf '\n'
    printf '     Specifies the commands that will be executed before everything else in order to update the content\n'
    printf '\n'
    printf ' -c, --commands <commands>\n'
    printf '\n'
    printf '     Specifies the commands that will be executed before everything else\n'
    printf '\n'
    printf ' -m, --commit-message <message>\n'
    printf '\n'
    printf '     Specifies the commit message\n'
    printf '\n'
}

print_in_green() {
    printf "\e[0;32m$1\e[0m"
}

print_in_red() {
    printf "\e[0;31m$1\e[0m"
}

print_result() {
    [ $1 -eq 0 ] \
        && print_success "$2" \
        || print_error "$2"

    return $1
}

print_success() {
    print_in_green "$LOG_PREFIX [✔] $1\n"
}

remove_sensitive_information() {

    declare -r CENSURE_TEST='[secure]';

    while read line; do

        line="${line//${GH_TOKEN}/$CENSURE_TEST}"
        line="${line//${GH_USER_EMAIL}/$CENSURE_TEST}"
        line="${line//${GH_USER_NAME}/$CENSURE_TEST}"

        print_error "$line"

    done

}

run_travis_after_all() {

    command -v "$(npm bin 2> /dev/null)/travis-after-all" &> /dev/null

    if [ $? -eq 0 ]; then
        $(npm bin)/travis-after-all
    else
        curl -sSL https://raw.githubusercontent.com/alrra/travis-after-all/1.4.3/lib/travis-after-all.js | node
    fi

}

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

main() {

    local branch=
    local commands=
    local commitMessage=

    local allOptionsAreProvided='true'

    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    while :; do
        case $1 in

            -h|--help)
                print_help_message
                exit
            ;;

            -b|--branch)
                if [ -n "$2" ]; then
                    branch="$2"
                    shift 2
                    continue
                else
                    print_error 'ERROR: A non-empty "-b/--branch <branch_name>" argument needs to be specified'
                    exit 1
                fi
            ;;

            -c|--commands)
                if [ -n "$2" ]; then
                    commands="$2"
                    shift 2
                    continue
                else
                    print_error 'ERROR: A non-empty "-c/--commands <commands>" argument needs to be specified'
                    exit 1
                fi
            ;;

            -m|--commit-message)
                if [ -n "$2" ]; then
                    commitMessage="$2"
                    shift 2
                    continue

                else
                    print_error 'ERROR: A non-empty "-m/--commit-message <message>" argument needs to be specified'
                    exit 1
                fi
            ;;

           -?*) printf 'WARNING: Unknown option (ignored): %s\n' "$1" >&2;;
             *) break
        esac

        shift
    done

    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    # Check if all the required options are provided

    if [ -z "$branch" ]; then
        print_error 'ERROR: option "-b/--branch <branch_name>" not given (see --help)'
        allOptionsAreProvided='false'
    fi

    if [ -z "$commands" ]; then
        print_error 'ERROR: option "-c/--commands <commands>" not given (see --help).'
        allOptionsAreProvided='false'
    fi

    if [ -z "$commitMessage" ]; then
        print_error 'ERROR: option "-m/--commit-message <message>" not given (see --help).'
        allOptionsAreProvided='false'
    fi

    [ "$allOptionsAreProvided" == 'false' ] \
        && exit 1

    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    # Only execute the following if the
    # commit was made to the specified branch

    if [ "$TRAVIS_BRANCH" == "$branch" ] && \
       [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

        run_travis_after_all
        [ $? -ne 0 ] && exit 1

        # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        execute "$commands" \
            2> >(remove_sensitive_information) \
            1> /dev/null
        print_result $? "Update content"
        [ $? -ne 0 ] && exit 1

        commit_and_push_changes "$branch" "$commitMessage" \
            2> >(remove_sensitive_information) \
            1> /dev/null
        print_result $? "Commit and push changes (if necessary)"

    fi

}

main "$@"
