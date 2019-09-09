// HTTP library
const request = require("request");

// Library for utils functions for date & time
const moment = require('moment');

const validateHelper = require('./validate-helper');

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
    },

    /**
     * Split Array of strings
     * @description *This function is not creating the best chunk combination (see in one of the examples)*
     *
     * @param {Array<T>|T[]} arr
     * @param {number} totalCharsInChunk
     * @param {function(T): string} getStringFromItem
     * @param {number} separatorLen The length of the separator to take into account when calculating (good for use with join)
     * @return {{chunks: Array<T>|T[], leftOut: Array<T>|T[]}} Return the chunks of item and the items that couldn't be inside the chunk
     *
     * @template T
     *
     * @example String Array Example
     * // For this args
     * arr = ['1', '23', '4', '56', '7', '89']
     * totalCharsInChunk = 3
     * separationLen = 0
     * //
     * // the result will be
     * {
     *     chunks:   [ ['1', '23'], ['4', '56'], ['7', '89'] ],
     *     leftOut: []
     * }
     *
     * @example Demonstrating that the function doesn't creating the best chunk combination
     * // For this args
     * arr = ['1', '2', '34', '56', '7', '89']
     * totalCharsInChunk = 3
     * separationLen = 0
     * //
     * // the result will be
     * {
     *    "chunks":  [ ['1', '2'], ['34'], ['56', '7'], ['89'] ],
     *    "leftOut": []
     * }
     * //
     * // But the best chunk combination for this situation is
     * {
     *     chunks:  [ [ '1', '34' ], ['2', '89'], ['56', '7'] ],
     *     leftOut: []
     * }
     *
     * **This way it uses the full `totalCharsInChunk`**
     *
     */
    splitIntoChunksBasedOnCharactersCount: (arr, totalCharsInChunk, getStringFromItem = (item) => item.toString(), separatorLen = 0) => {
        validateArgsForSplitIntoChunksBasedOnCharactersCount(arr, totalCharsInChunk, separatorLen);

        getStringFromItem = getStringFromItem || ((item) => item.toString());
        separatorLen = separatorLen || 0;

        if (arr.length === 0) {
            return {chunks: [], leftOut: []};
        }

        let chunksArr = [];
        let chunk = [];
        let itemStr;
        let charsCount = 0;

        let leftOutItems = [];

        arr.forEach((item) => {
            itemStr = getStringFromItem(item);

            if (!itemStr.length || itemStr.length + separatorLen > totalCharsInChunk) {
                leftOutItems.push(item);
                return;
            }

            if (charsCount + itemStr.length + separatorLen > totalCharsInChunk) {
                if (charsCount === 0) {
                    return;
                }

                chunksArr.push(chunk);
                chunk = [];
                charsCount = 0;
            }

            chunk.push(item);
            charsCount += item.length + separatorLen;
        });

        if(chunk.length > 0) {
            chunksArr.push(chunk);
            chunk = [];
            charsCount = 0;
        }

        return {
            chunks: chunksArr,
            leftOut: leftOutItems
        };
    }
};

function validateArgsForSplitIntoChunksBasedOnCharactersCount(arr, totalCharsInChunk, separatorLen) {
    validatePreSplitArr(arr);
    validateTotalCharsInChunk(totalCharsInChunk);
    validateSeparatorLen(separatorLen);
}

function validatePreSplitArr(arr) {
    if (!arr) {
        throw {
            message: 'The provided array (`arr`) is falsy',
            data: {
                arr: arr
            }
        };
    }
}

function validateTotalCharsInChunk(totalCharsInChunk) {
    validateTotalCharsInChunkIsNumber(totalCharsInChunk);
    validateTotalCharsInChunkGreaterThan0(totalCharsInChunk);
}

function validateTotalCharsInChunkIsNumber(totalCharsInChunk) {
    if (!validateHelper.isNumber(totalCharsInChunk)) {
        throw {
            message: 'The total characters in chunk argument (`totalCharsInChunk`) isn\'t a number',
            data: {
                totalCharsInChunk: totalCharsInChunk
            }
        };
    }
}

function validateTotalCharsInChunkGreaterThan0(totalCharsInChunk) {
    if (totalCharsInChunk <= 0) {
        throw {
            message: 'The total characters in chunk argument (`totalCharsInChunk`) need to be greater than 0',
            data: {
                totalCharsInChunk: totalCharsInChunk
            }
        };
    }
}

function validateSeparatorLen(separatorLen) {
    if (!validateHelper.isNumber(separatorLen)) {
        throw {
            message: 'The separator length argument (`separatorLen`) isn\'t a number',
            data: {
                totalCharsInChunk: separatorLen
            }
        };
    }

    if (separatorLen < 0) {
        throw {
            message: 'The separator length argument (`separatorLen`) need to be greater/equal to 0',
            data: {
                totalCharsInChunk: separatorLen
            }
        };
    }
}

// isValidFilePath

module.exports = utils;
