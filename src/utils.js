// HTTP library
const request = require("request");

// Library for utils functions for date & time
const moment = require('moment');

// File System
const fs = require("fs");

const Utils = {

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
    },

    /**
     * return if variable is number or not
     * @param num any variable to check
     * @return {boolean} true if the variable is a number
     */
    isNumber: function(num) {
        return typeof num === 'number';
    }
};

// isValidFilePath

module.exports = Utils;
