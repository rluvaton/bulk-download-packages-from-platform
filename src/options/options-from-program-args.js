// Parse command line arguments
const commandLineArgs = require('command-line-args');

const UserOptions = require('./user-options');

const UserOptionKeys = UserOptions.OptionKeys;
const DefaultUserOptions = UserOptions.default;

// region Declaring Typing for JSDoc

/**
 * @typedef {Object} OptionsFromProgramArgs
 * @property {function(*): Boolean} isArgsContainOptions
 * @property {function(*): UserOptions} getUserOptionsFromProgramArgs
 */

// endregion

/**
 * Option Definition for `command-line-args` library
 */
const optionDefinitions = [
    {
        name: 'default',
        alias: 'd',
        type: Boolean,
        defaultValue: false
    },
    {
        name: 'set-options',
        alias: 'o',
        type: Boolean,
        defaultValue: false
    },
    {
        name: UserOptionKeys.TOTAL_PACKAGES,
        type: Number,
        defaultValue: DefaultUserOptions.totalPackages
    },
    {
        name: UserOptionKeys.STARTING_PAGE,
        type: Number,
        defaultValue: DefaultUserOptions.startingPage
    },
    {
        name: UserOptionKeys.SCRIPT_HANDLE_OPTION,
        type: String,
        defaultValue: DefaultUserOptions.scriptHandleOptions
    },
    {
        name: UserOptionKeys.FILE_PATH,
        type: String,
        defaultValue: DefaultUserOptions.filePath
    },
    {
        name: UserOptionKeys.PLATFORM,
        alias: 'p',
        type: String,
        defaultValue: DefaultUserOptions.platform
    },
    {
        name: UserOptionKeys.SORT_BY,
        type: String,
        defaultValue: DefaultUserOptions.sortBy
    }
];

/**
 * Options From Program Args handler
 * @type {OptionsFromProgramArgs}
 */
const OptionsFromProgramArgs = {

    isArgsContainOptions: (args) => {
        let options;

        try {
            options = commandLineArgs(optionDefinitions);
        } catch (e) {
            console.error('Error at parsing program args');
            console.error(e);
            return false;
        }

        if (!options || Object.keys(options).length === 0) {
            return false;
        }

        // Convert from falsy/truthy value to false/true
        return !!(options.default || options['set-options']);
    },

    getUserOptionsFromProgramArgs: (args) => {
        let options = commandLineArgs(optionDefinitions);

        return new UserOptions(options.default ? {} : options);
    }
};

module.exports = OptionsFromProgramArgs;
