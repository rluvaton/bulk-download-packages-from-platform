// HTTP library
const request = require("request");

// Library for utils functions for date & time
const moment = require('moment');

// File System
const fs = require("fs");

const Utils = {

    /**
     * Parse bytes to human readable text
     * @param {number} bytes
     * @param {boolean} si SI prefix (i.e si = true is GB | si = false is GiB)
     * @return {string} The size in readable text
     *
     * @example si = true
     * parseBytesToHumanReadable(32000000, true)
     * // returns '32.0 MB'
     *
     * @example si = false
     * parseBytesToHumanReadable(32000000, false)
     * // returns '30.5 MiB'
     */
    parseBytesToHumanReadable: function (bytes, si = false) {
        const thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);

        return `${bytes.toFixed(1)} ${units[u]}`;
    },

    /**
     * Return promise that resolve after the milliseconds that provided passed
     * @param {number} ms Milliseconds to sleep
     * @return {Promise} Waiting promise
     */
    sleep: function (ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    },

    /**
     * Create `request` call that return promise - resolve with the data or rejected with the error
     * @param options UserOptions for the request
     * @param {boolean} getBody If the promise should return the body or the whole request
     * @return {Promise} The response body / response as promise
     */
    requestWithPromise: function (options, getBody = true) {
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(getBody ? body : response);
            });
        });
    },

    /**
     * The default error handling
     * @param err Error that raised
     */
    defaultErrorHandling: function (err) {
        console.error(err);
    },

    /**
     * Get the UTC timestamp (as milliseconds) from date & time string
     * @param {string} date
     * @return {number} UTC timestamp in milliseconds
     */
    getUTCTimestampFromDateStr: function (date) {
        return moment(date).utc().valueOf()
    },

    validatePath: function (path) {

        // 1 - if path exist
        // 1.1 true: if path is file
        // 1.1.1 true: GOOD
        // 1.1.1 false: BAD
        // 1.1 false: if parent folder exist:
        // 1.1.1 true: GOOD
        // 1.1.1 false: BAD

        if (isPathExist(path)) {
            return isPathAFile(path);
        }

        return isParentFolderExist(path);
    },

    /**
     * Check if path exist
     * @param {string} path File/Directory Path to test
     * @return {boolean} file/directory existence
     */
    isPathExist: function (path) {
        return fs.existsSync(path);
    },

    /**
     * Check if parent folder of file/folder exists
     * @param {string} path Path to file/directory
     * @return {boolean} If parent folder existence
     */
    isParentFolderExist: function (path) {
        if (!path) {
            return false;
        }

        // If already a path
        if (path.endsWith('\\') || path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        let lastSlashIndex = Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/'));

        const parentPath = lastSlashIndex !== -1 ? path.substr(0, lastSlashIndex) : path;
        return fs.existsSync(parentPath);
    },

    /**
     * Validate path to be file or folder
     * @param {string} path Path to validate
     * @param {boolean} isFileType True to compare with file type, false for checking if directory
     * @return {boolean} If the type of a path is like `isFileType` value (true: file, false: folder)
     */
    validatePathType: function (path, isFileType) {
        const pathStat = fs.lstatSync(path);
        return isFileType ? pathStat.isFile() : pathStat.isDirectory();
    },

    /**
     * Write to file the content (Overwrite if already exist)
     * @param {string} path Path to file
     * @param content content to write in the file
     * @return {Promise}
     */
    writeFile: function(path, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content, (err) => {
                if(err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    },

    /**
     * Check if value is either `null` or `undefined`
     * @param value Value to check
     * @return {boolean} The result if the value is nil
     */
    isNil: function (value) {
        // from SO answer - https://stackoverflow.com/a/5515385/5923666
        return value == null;
    }
};

// isValidFilePath

module.exports = Utils;
