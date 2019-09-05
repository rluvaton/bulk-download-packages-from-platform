// HTTP library
const request = require("request");

// Library for utils functions for date & time
const moment = require('moment');

const utils = {

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
    }

};

// isValidFilePath

module.exports = utils;
