
// HTTP library
const request = require("request");

// Library for utils functions for date & time
const moment = require('moment');

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

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

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

function defaultErrorHandling(err) {
    console.error(err);
}

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
