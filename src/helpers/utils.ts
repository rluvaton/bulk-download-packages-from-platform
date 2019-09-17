// HTTP library
import * as request from 'request';
// Library for utils functions for date & time
import * as moment from 'moment';

import {isNumber} from './validate-helper';
import * as Observable from 'zen-observable';
import * as progress from 'request-progress';

export interface SplitIntoChunksResult<T> {
  chunks: T[][];
  leftOut: T[];
}

const defaultGetString = (item) => item.toString();

/**
 * Split Array of strings
 * @description *This function is not creating the best chunk combination (see in one of the examples)*
 *
 * @param arr
 * @param totalCharsInChunk
 * @param getStrFromItem
 * @param separatorLen The length of the separator to take into account when calculating (good for use with join)
 * @return Return the chunks of item and the items that couldn't be inside the chunk
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
export function splitIntoChunksBasedOnCharsCount<T>(arr: T[],
                                                    totalCharsInChunk: number,
                                                    getStrFromItem: (item: T) => string = defaultGetString,
                                                    separatorLen: number = 0): SplitIntoChunksResult<T> {
  validateArgsForSplitIntoChunksBasedOnCharsCount(arr, totalCharsInChunk, separatorLen);

  getStrFromItem = getStrFromItem || ((item) => item.toString());
  separatorLen = separatorLen || 0;

  if (arr.length === 0) {
    return {chunks: [], leftOut: []};
  }

  const chunksArr: T[][] = [];
  let chunk: T[] = [];
  let itemStr: string;
  let charsCount: number = 0;

  const leftOutItems: T[] = [];

  arr.forEach((item) => {
    itemStr = getStrFromItem(item);

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
    charsCount += itemStr.length + separatorLen;
  });

  if (chunk.length > 0) {
    chunksArr.push(chunk);
    chunk = [];
    charsCount = 0;
  }

  return {
    chunks: chunksArr,
    leftOut: leftOutItems
  };
}

/**
 * Return promise that resolve after the milliseconds that provided passed
 * @param {number} ms Milliseconds to sleep
 * @return {Promise} Waiting promise
 */
export function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Create `request` call that return promise - resolve with the data or rejected with the error
 * @param options Options for the request
 * @param {boolean} getBody If the promise should return the body or the whole request
 * @return {Promise} The response body / response as promise
 */
export function requestWithPromise(options: any, getBody: boolean = true): Promise<Response | any> {
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

export function requestWithProgress(options, getBody: boolean = true, responseCallback: (data: any) => any = (data) => {
}): Observable<{ speed: number, percent: number }> {
  return new Observable<{ speed: number, percent: number }>((observer) => {
    // The options argument is optional so you can omit it
    progress(request(options, (error, response, body) => {
      if (error) {
        observer.error(error);
        return;
      }

      responseCallback(getBody ? body : response);
    }))
      .on('progress', (state) => {
        // The state is an object that looks like this:
        // {
        //     percent: 0.5,               // Overall percent (between 0 to 1)
        //     speed: 554732,              // The download speed in bytes/sec
        //     size: {
        //         total: 90044871,        // The total payload size in bytes
        //         transferred: 27610959   // The transferred payload size in bytes
        //     },
        //     time: {
        //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals)
        //         remaining: 81.403       // The remaining seconds to finish (3 decimals)
        //     }
        // }
        observer.next({
          percent: state.percent,
          speed: state.speed
        });
      })
      .on('error', function(err) {
        observer.error(err);
      })
      .on('end', function() {
        if (!observer.closed) {
          observer.complete();
        }
      });
  });
}

/**
 * The default error handling
 * @param err Error that raised
 */
export function defaultErrorHandling(err): void {
  console.error(err);
}

/**
 * Get the UTC timestamp (as milliseconds) from date & time string
 * @param {string} date
 * @return {number} UTC timestamp in milliseconds
 */
export function getUTCTimestampFromDateStr(date: string): number {
  return moment(date).utc().valueOf();
}

function validateArgsForSplitIntoChunksBasedOnCharsCount(arr: any[], totalCharsInChunk: number, separatorLen: number): void {
  validatePreSplitArr(arr);
  validateTotalCharsInChunk(totalCharsInChunk);
  validateSeparatorLen(separatorLen);
}

function validatePreSplitArr(arr: any[]): void {
  if (!arr) {
    throw {
      message: 'The provided array (`arr`) is falsy',
      data: {
        arr: arr
      }
    };
  }
}

function validateTotalCharsInChunk(totalCharsInChunk: number): void {
  validateTotalCharsInChunkIsNumber(totalCharsInChunk);
  validateTotalCharsInChunkGreaterThan0(totalCharsInChunk);
}

function validateTotalCharsInChunkIsNumber(totalCharsInChunk: number): void {
  if (!isNumber(totalCharsInChunk)) {
    throw {
      message: 'The total characters in chunk argument (`totalCharsInChunk`) isn\'t a number',
      data: {
        totalCharsInChunk: totalCharsInChunk
      }
    };
  }
}

function validateTotalCharsInChunkGreaterThan0(totalCharsInChunk: number): void {
  if (totalCharsInChunk <= 0) {
    throw {
      message: 'The total characters in chunk argument (`totalCharsInChunk`) need to be greater than 0',
      data: {
        totalCharsInChunk: totalCharsInChunk
      }
    };
  }
}

function validateSeparatorLen(separatorLen: number): void {
  if (!isNumber(separatorLen)) {
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

export function humanFileSize(bytes: number, si: boolean = true): string {
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

  return bytes.toFixed(1) + ' ' + units[u];
}
