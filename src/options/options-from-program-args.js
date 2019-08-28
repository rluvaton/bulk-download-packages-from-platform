// Parse command line arguments
const commandLineArgs = require('command-line-args');

const utils = require('../utils');
const SharedOptionsUtils = require('./shared-options-utils');
const ScriptHandleOptions = require('../common/script-handle-option');
const SortOptions = require('../common/sort-options');
const Platforms = require('../common/platforms');
const UserOptions = require('./user-options');

const UserOptionKeys = UserOptions.OptionKeys;
const DefaultUserOptions = UserOptions.default;

// region Declaring Typing for JSDoc

/**
 * @typedef {Object} OptionsFromProgramArgs
 * @property {function(*): Boolean} isArgsContainOptions
 * @property {function(*): Promise<UserOptions>} getUserOptionsFromProgramArgs
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
        defaultValue: DefaultUserOptions.scriptHandleOption
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

function validateFilePath(options) {
    return new Promise((resolve) => {
        if (!utils.isNil(options.filePath) && options.scriptHandleOption === ScriptHandleOptions.WRITE_TO_FILE) {
            // In case of an error it should call the catch function, if no error it should resolve
            SharedOptionsUtils.validateWriteToFilePath(options.filePath, true);
        }

        resolve(options);
    }).catch((err) => {
        throw {message: 'File path is invalid', filePath: options.filePath, innerException: err};
    });
}

function validateTotalPackages(options) {
    return new Promise((resolve, reject) => {
        if (!utils.isNil(options.totalPackages) && (!utils.isNumber(options.totalPackages) || options.totalPackages <= 0)) {
            reject({message: 'Invalid total packages', totalPackages: options.totalPackages});
            return;
        }

        resolve(options);
    });
}

function validateStartingPage(options) {
    return new Promise((resolve, reject) => {
        if (!utils.isNil(options.startingPage) && (!utils.isNumber(options.startingPage) || options.startingPage <= 0)) {
            reject({message: 'Invalid starting page', startingPage: options.startingPage});
            return;
        }

        resolve(options);
    });
}

function validateScriptHandleOption(options) {
    return new Promise((resolve, reject) => {

        if (!utils.isNil(options.scriptHandleOption) && !(Object.values(ScriptHandleOptions).includes(options.scriptHandleOption))) {
            reject({message: 'Invalid script handle option', scriptHandleOption: options.scriptHandleOption});
            return;
        }

        resolve(options);
    });
}

function validatePlatform(options) {
    return new Promise((resolve, reject) => {

        if (!utils.isNil(options.platform) && !(Object.values(Platforms).includes(options.platform))) {
            reject({message: 'Invalid platform', platform: options.platform});
            return;
        }

        resolve(options);
    });
}

function validateSortBy(options) {
    return new Promise((resolve, reject) => {

        if (!utils.isNil(options.sortBy) && !(Object.values(SortOptions).includes(options.sortBy))) {
            reject({message: 'Invalid sort by', sortBy: options.sortBy});
            return;
        }

        resolve(options);
    });
}

/**
 * Validate options (only the options that specified in the program args
 * @param options Program args options
 * @return {Promise}
 */
async function validateOptions(options) {
    const errors = [];

    const addToErrorArr = (err) => errors.push(err);

    await validateTotalPackages(options).catch(addToErrorArr);
    await validateStartingPage(options).catch(addToErrorArr);
    await validateScriptHandleOption(options).catch(addToErrorArr);
    await validateFilePath(options).catch(addToErrorArr);
    await validatePlatform(options).catch(addToErrorArr);
    await validateSortBy(options).catch(addToErrorArr);

    if(errors.length > 0) {
        return Promise.reject({errors: errors});
    }

    return options;
}

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
            console.error('Error at parsing program args:\n', e.message);
            return false;
        }

        if (!options || Object.keys(options).length === 0) {
            return false;
        }

        // Convert from falsy/truthy value to false/true
        return !!(options.default || options['set-options']);
    },

    getUserOptionsFromProgramArgs: async (args) => {
        let options = commandLineArgs(optionDefinitions);

        return validateOptions(options)
            .then(() => new UserOptions(options.default ? {} : options));
    }
};

module.exports = OptionsFromProgramArgs;
