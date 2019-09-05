// Get input from user
const prompts = require('prompts');
const sharedOptionsUtils = require('./shared-options-utils');

const scriptHandleOptions = require('../common/script-handle-option');
const sortOptions = require('../common/sort-options');
const platforms = require('../common/platforms');

const UserOptions = require('./user-options');

const UserOptionKeys = UserOptions.OptionKeys;
const DefaultUserOptions = UserOptions.default;


const sortByChoices = [
    {value: sortOptions.RANK, title: sortOptions.RANK},
    {value: sortOptions.STARS, title: sortOptions.STARS},
    {value: sortOptions.DEPENDENTS_COUNT, title: sortOptions.DEPENDENTS_COUNT},
    {value: sortOptions.DEPENDENT_REPOS_COUNT, title: sortOptions.DEPENDENT_REPOS_COUNT},
    {value: sortOptions.LATEST_RELEASE_PUBLISHED_AT, title: sortOptions.LATEST_RELEASE_PUBLISHED_AT},
    {value: sortOptions.CONTRIBUTIONS_COUNT, title: sortOptions.CONTRIBUTIONS_COUNT},
    {value: sortOptions.CREATED_AT, title: sortOptions.CREATED_AT}
];

const platformChoices = [
    {value: platforms.NPM, title: platforms.NPM},
    {value: platforms.GO, title: platforms.GO},
    {value: platforms.PACKAGIST, title: platforms.PACKAGIST},
    {value: platforms.PYPI, title: platforms.PYPI},
    {value: platforms.MAVEN, title: platforms.MAVEN},
    {value: platforms.NUGET, title: platforms.NUGET},
    {value: platforms.RUBYGEMS, title: platforms.RUBYGEMS},
    {value: platforms.BOWER, title: platforms.BOWER},
    {value: platforms.WORD_PRESS, title: platforms.WORD_PRESS},
    {value: platforms.COCOA_PODS, title: platforms.COCOA_PODS},
    {value: platforms.CPAN, title: platforms.CPAN},
    {value: platforms.CARGO, title: platforms.CARGO},
    {value: platforms.CLOJARS, title: platforms.CLOJARS},
    {value: platforms.CRAN, title: platforms.CRAN},
    {value: platforms.HACKAGE, title: platforms.HACKAGE},
    {value: platforms.METEOR, title: platforms.METEOR},
    {value: platforms.ATOM, title: platforms.ATOM},
    {value: platforms.HEX, title: platforms.HEX},
    {value: platforms.PUB, title: platforms.PUB},
    {value: platforms.PLATFORM_IO, title: platforms.PLATFORM_IO},
    {value: platforms.PUPPET, title: platforms.PUPPET},
    {value: platforms.EMACS, title: platforms.EMACS},
    {value: platforms.HOMEBREW, title: platforms.HOMEBREW},
    {value: platforms.SWIFT_PM, title: platforms.SWIFT_PM},
    {value: platforms.CARTHAGE, title: platforms.CARTHAGE},
    {value: platforms.JULIA, title: platforms.JULIA},
    {value: platforms.SUBLIME, title: platforms.SUBLIME},
    {value: platforms.DUB, title: platforms.DUB},
    {value: platforms.RACKET, title: platforms.RACKET},
    {value: platforms.ELM, title: platforms.ELM},
    {value: platforms.HAXELIB, title: platforms.HAXELIB},
    {value: platforms.NIMBLE, title: platforms.NIMBLE},
    {value: platforms.ALCATRAZ, title: platforms.ALCATRAZ},
    {value: platforms.PURE_SCRIPT, title: platforms.PURE_SCRIPT},
    {value: platforms.INQLUDE, title: platforms.INQLUDE}
];

/**
 * Get the index of the initial value in the choices
 * @param {string} userOptionKey The
 * @param {Array<{value: string|title: string}>|{value: string|title: string}[]} choices
 * @return {number} Index of the initial choice
 */
function getInitialIndexFromChoicesAndName(userOptionKey, choices) {
    const initialValue = UserOptions.default[userOptionKey];
    return choices.findIndex((choice) => choice.value === initialValue);
}

const scriptHandleOptionsChoices = [
    {title: 'Print it', value: scriptHandleOptions.PRINT},
    {title: 'Write to file', value: scriptHandleOptions.WRITE_TO_FILE},
];

const optionsFromUserInput = {
    /**
     * {prompts.PromptObject<T> | Array<prompts.PromptObject<T>>} Configuration questions
     */
    questions: [
        {
            type: 'number',
            name: UserOptionKeys.TOTAL_PACKAGES,
            message: 'How many packages do you want?',
            initial: DefaultUserOptions[UserOptionKeys.TOTAL_PACKAGES],
            min: 1
        },
        {
            type: 'number',
            name: UserOptionKeys.STARTING_PAGE,
            message: 'From which page do you wanna start? (default is 1)',
            initial: DefaultUserOptions[UserOptionKeys.STARTING_PAGE],
            min: 1
        },
        {
            type: 'confirm',
            name: UserOptionKeys.ADVANCE_OPTIONS,
            message: 'Enter advance options?',
            initial: DefaultUserOptions[UserOptionKeys.ADVANCE_OPTIONS]
        },
        {
            type: (prev, values) => values[UserOptionKeys.ADVANCE_OPTIONS] ? 'select' : null,
            name: UserOptionKeys.SCRIPT_HANDLE_OPTION,
            message: 'How do you want to handle the script?',
            choices: scriptHandleOptionsChoices,
            initial: getInitialIndexFromChoicesAndName(UserOptionKeys.SCRIPT_HANDLE_OPTION, scriptHandleOptionsChoices),
        },
        {
            type: (prev) => prev === scriptHandleOptions.WRITE_TO_FILE ? 'text' : null,
            name: UserOptionKeys.FILE_PATH,
            message: 'Please Enter the file path you want to add',
            validate: (path) => {
                let result;
                try {
                    result = sharedOptionsUtils.validateWriteToFilePath(path, true);
                } catch(error) {
                    result = error.message;
                }

                return result;
            },
            initial: DefaultUserOptions[UserOptionKeys.FILE_PATH]
        },
        {
            type: (prev, values) => values[UserOptionKeys.ADVANCE_OPTIONS] ? 'select' : null,
            name: UserOptionKeys.PLATFORM,
            message: 'Choose platform',
            choices: platformChoices,
            initial: getInitialIndexFromChoicesAndName(UserOptionKeys.PLATFORM, platformChoices),
        },
        {
            type: (prev, values) => values[UserOptionKeys.ADVANCE_OPTIONS] ? 'select' : null,
            name: UserOptionKeys.SORT_BY,
            message: 'Choose what is the sort parameter',
            choices: sortByChoices,
            initial: getInitialIndexFromChoicesAndName(UserOptionKeys.SORT_BY, sortByChoices),
        }
    ],

    /**
     * Get Options from input
     * @return {Promise<UserOptions>}
     */
    getOptionsFromInput() {
        return prompts(this.questions).then((options) => new UserOptions(options));
    }
};

module.exports = optionsFromUserInput;
