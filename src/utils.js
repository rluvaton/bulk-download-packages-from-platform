
// HTTP library
const request = require("request");

// Library for utils functions for date & time
const moment = require('moment');

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
function parseBytesToHumanReadable(bytes, si) {
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
}

/**
 * Return promise that resolve after the milliseconds that provided passed
 * @param {number} ms Milliseconds to sleep
 * @return {Promise} Waiting promise
 */
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

/**
 * Create `request` call that return promise - resolve with the data or rejected with the error
 * @param options Options for the request
 * @param {boolean} getBody If the promise should return the body or the whole request
 * @return {Promise} The response body / response as promise
 */
function requestWithPromise(options, getBody = true) {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(getBody ? body : response);
        });
    });
}

/**
 * The default error handling
 * @param err Error that raised
 */
function defaultErrorHandling(err) {
    console.error(err);
}

/**
 * Get the UTC timestamp (as milliseconds) from date & time string
 * @param {string} date
 * @return {number} UTC timestamp in milliseconds
 */
function getUTCTimestampFromDateStr(date) {
    return moment(date).utc().valueOf()
}

module.exports = {
    parseBytesToHumanReadable,
    sleep,
    requestWithPromise,
    getUTCTimestampFromDateStr,
    defaultErrorHandling
};
