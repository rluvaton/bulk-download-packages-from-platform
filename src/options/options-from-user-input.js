// Get input from user
const prompts = require('prompts');

const utils = require('../utils');

const ScriptHandleOptions = require('../common/script-handle-option');
const SortOptions = require('../common/sort-options');
const Platforms = require('../common/platforms');

const UserOptions = require('./user-options');

const UserOptionKeys = UserOptions.OptionKeys;
const DefaultUserOptions = UserOptions.default;


const sortByChoices = [
    {value: SortOptions.RANK, title: SortOptions.RANK},
    {value: SortOptions.STARS, title: SortOptions.STARS},
    {value: SortOptions.DEPENDENTS_COUNT, title: SortOptions.DEPENDENTS_COUNT},
    {value: SortOptions.DEPENDENT_REPOS_COUNT, title: SortOptions.DEPENDENT_REPOS_COUNT},
    {value: SortOptions.LATEST_RELEASE_PUBLISHED_AT, title: SortOptions.LATEST_RELEASE_PUBLISHED_AT},
    {value: SortOptions.CONTRIBUTIONS_COUNT, title: SortOptions.CONTRIBUTIONS_COUNT},
    {value: SortOptions.CREATED_AT, title: SortOptions.CREATED_AT}
];

const platformChoices = [
    {value: Platforms.NPM, title: Platforms.NPM},
    {value: Platforms.GO, title: Platforms.GO},
    {value: Platforms.PACKAGIST, title: Platforms.PACKAGIST},
    {value: Platforms.PYPI, title: Platforms.PYPI},
    {value: Platforms.MAVEN, title: Platforms.MAVEN},
    {value: Platforms.NUGET, title: Platforms.NUGET},
    {value: Platforms.RUBYGEMS, title: Platforms.RUBYGEMS},
    {value: Platforms.BOWER, title: Platforms.BOWER},
    {value: Platforms.WORD_PRESS, title: Platforms.WORD_PRESS},
    {value: Platforms.COCOA_PODS, title: Platforms.COCOA_PODS},
    {value: Platforms.CPAN, title: Platforms.CPAN},
    {value: Platforms.CARGO, title: Platforms.CARGO},
    {value: Platforms.CLOJARS, title: Platforms.CLOJARS},
    {value: Platforms.CRAN, title: Platforms.CRAN},
    {value: Platforms.HACKAGE, title: Platforms.HACKAGE},
    {value: Platforms.METEOR, title: Platforms.METEOR},
    {value: Platforms.ATOM, title: Platforms.ATOM},
    {value: Platforms.HEX, title: Platforms.HEX},
    {value: Platforms.PUB, title: Platforms.PUB},
    {value: Platforms.PLATFORM_IO, title: Platforms.PLATFORM_IO},
    {value: Platforms.PUPPET, title: Platforms.PUPPET},
    {value: Platforms.EMACS, title: Platforms.EMACS},
    {value: Platforms.HOMEBREW, title: Platforms.HOMEBREW},
    {value: Platforms.SWIFT_PM, title: Platforms.SWIFT_PM},
    {value: Platforms.CARTHAGE, title: Platforms.CARTHAGE},
    {value: Platforms.JULIA, title: Platforms.JULIA},
    {value: Platforms.SUBLIME, title: Platforms.SUBLIME},
    {value: Platforms.DUB, title: Platforms.DUB},
    {value: Platforms.RACKET, title: Platforms.RACKET},
    {value: Platforms.ELM, title: Platforms.ELM},
    {value: Platforms.HAXELIB, title: Platforms.HAXELIB},
    {value: Platforms.NIMBLE, title: Platforms.NIMBLE},
    {value: Platforms.ALCATRAZ, title: Platforms.ALCATRAZ},
    {value: Platforms.PURE_SCRIPT, title: Platforms.PURE_SCRIPT},
    {value: Platforms.INQLUDE, title: Platforms.INQLUDE}
];

/**
 * Get the index of the initial value in the choices
 * @param {string} userOptionKey The
 * @param {Array<{value: string|title: string}>|{value: string|title: string}[]} choices
 * @return {number} Index of the initial choice
 */
function getInitialIndexFromChoicesAndName(userOptionKey, choices) {
    const initialValue = UserOptions[userOptionKey];
    return choices.findIndex((choice) => choice.value === initialValue);
}

const scriptHandleOptionsChoices = [
    {title: 'Print it', value: ScriptHandleOptions.PRINT},
    {title: 'Write to file', value: ScriptHandleOptions.WRITE_TO_FILE},
];

const OptionsFromUserInput = {
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
            type: (prev) => prev === ScriptHandleOptions.WRITE_TO_FILE ? 'text' : null,
            name: UserOptionKeys.FILE_PATH,
            message: 'Please Enter the file path you want to add',
            initial: DefaultUserOptions[UserOptionKeys.FILE_PATH],
            validate: (filePath) => {
                if (!filePath) {
                    return false;
                }

                if (utils.isPathExist(filePath)) {
                    return utils.validatePathType(filePath, true);
                }

                return utils.isParentFolderExist(path);
            }
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

module.exports = OptionsFromUserInput;
