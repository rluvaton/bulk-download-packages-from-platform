const ScriptHandleOptions = require('../common/script-handle-option');
const Platforms = require('../common/platforms');
const SortOptions = require('../common/sort-options');

// region Declaring Typing for JSDoc

/**
 * @typedef {Object} UserOptions
 * @property {number} totalPackages - Total packages to fetch
 * @property {number} startingPage - From which page to start fetching packages
 * @property {ScriptHandleOptions} scriptHandleOption - How to handle the script
 * @property {string} filePath - File path in case that `file` is chosen in `scriptHandleOptions` option
 * @property {Platforms} platform - Platform to get the packages from
 * @property {SortOptions} sortBy - at which order to get the packages (i.e get from npm the packages with the top dependents count)
 * @property {number} charsAmountInSingleScript - The amount of characters in single script
 */

// endregion

/**
 * Keys of the `UserOptions`
 * @type {{PLATFORM: string, TOTAL_PACKAGES: string, CHARS_AMOUNT_IN_SINGLE_SCRIPT: string, SORT_BY: string, ADVANCE_OPTIONS: string, SCRIPT_HANDLE_OPTION: string, STARTING_PAGE: string, FILE_PATH: string}}
 */
const OptionKeys = {
    TOTAL_PACKAGES: 'totalPackages',
    STARTING_PAGE: 'startingPage',
    ADVANCE_OPTIONS: 'advanceOptions',
    SCRIPT_HANDLE_OPTION: 'scriptHandleOption',
    FILE_PATH: 'filePath',
    PLATFORM: 'platform',
    SORT_BY: 'sortBy',
    CHARS_AMOUNT_IN_SINGLE_SCRIPT: 'charsAmountInSingleScript'
};

const defaultOptions = {
    [OptionKeys.TOTAL_PACKAGES]: 100,
    [OptionKeys.STARTING_PAGE]: 1,
    [OptionKeys.ADVANCE_OPTIONS]: false,
    [OptionKeys.SCRIPT_HANDLE_OPTION]: ScriptHandleOptions.WRITE_TO_FILE,
    [OptionKeys.FILE_PATH]: './packages-download-script.bat',
    [OptionKeys.PLATFORM]: Platforms.NPM,
    [OptionKeys.SORT_BY]: SortOptions.DEPENDENTS_COUNT,
    [OptionKeys.CHARS_AMOUNT_IN_SINGLE_SCRIPT]: 2047
};

/**
 * @param {*} options UserOptions
 * @param {boolean} setEmptyOptionsAsDefault Set the the empty options as default
 * @constructor
 */
function UserOptions(options, setEmptyOptionsAsDefault = true) {
    options = options || {};

    /**
     * Total packages to fetch
     * @type {number}
     * @default 100
     */
    this.totalPackages = options.totalPackages;

    /**
     * From which page to start fetching packages
     * @type {number}
     * @default 1
     */
    this.startingPage = options.startingPage;

    /**
     * How to handle the script
     * @type {ScriptHandleOptions}
     * @default ScriptHandleOptions.WRITE_TO_FILE
     */
    this.scriptHandleOption = options.scriptHandleOption;

    /**
     * File path in case that `file` is chosen in `scriptHandleOptions` option
     * @type {string}
     * @default './packages-download-script.bat'
     */
    this.filePath = options.filePath;

    /**
     * Platform to get the packages from
     * @type {Platforms}
     * @default PlatformOptions.NPM
     */
    this.platform = options.platform;

    /**
     * At which order to get the packages (i.e get from npm the packages with the top dependents count)
     * @type {SortOptions}
     * @default SortOptions.DEPENDENTS_COUNT
     */
    this.sortBy = options.sortBy;

    /**
     * The amount of characters in single script
     * @type {number}
     * @default defaultOptions.charsAmountInSingleScript
     */
    this.charsAmountInSingleScript = options.charsAmountInSingleScript;


    if (setEmptyOptionsAsDefault) {
        this.setEmptyOptionsAsDefault();
    }
}

UserOptions.prototype = {};

/**
 * Set the the empty options as default
 */
UserOptions.prototype.setEmptyOptionsAsDefault = function () {
    this.totalPackages = this.totalPackages > 0 ? this.totalPackages : defaultOptions[OptionKeys.TOTAL_PACKAGES];
    this.startingPage = this.startingPage > 0 ? this.startingPage : defaultOptions[OptionKeys.STARTING_PAGE];
    this.scriptHandleOption = this.scriptHandleOption || defaultOptions[OptionKeys.SCRIPT_HANDLE_OPTION];
    this.filePath = this.filePath || defaultOptions[OptionKeys.FILE_PATH];
    this.platform = this.platform || defaultOptions[OptionKeys.PLATFORM];
    this.sortBy = this.sortBy || defaultOptions[OptionKeys.SORT_BY];
    this.charsAmountInSingleScript = this.charsAmountInSingleScript || defaultOptions[OptionKeys.CHARS_AMOUNT_IN_SINGLE_SCRIPT];
};

/**
 * UserOptions properties in string
 * @type {OptionKeys}
 *
 * Making the `OptionKeys` value readonly
 */
Object.defineProperty(UserOptions, "OptionKeys", {
    value: OptionKeys,
    writable: false
});

/**
 * Default User Options
 * @type {UserOptions}
 *
 * Making the `default` value readonly
 */
Object.defineProperty(UserOptions, "default", {
    value: new UserOptions(null),
    writable: false
});

module.exports = UserOptions;

