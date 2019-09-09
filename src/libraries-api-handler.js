const utils = require('./helpers/utils');

// region Declaring Typing for JSDoc

/**
 * @typedef {Object} Package
 * @property {string} name - Package name (i.e react)
 * @property {string} platform - Platform that the package was taken from (i.e NPM)
 * @property {string} latestStableReleaseNumber - (i.e 1.5.1)
 * @property {number} latestStableReleasePublishTimestamp - The timestamp in UTC & milliseconds format that the version was published
 */

/**
 * @typedef {'rank'|'stars'|'dependents_count'|'dependent_repos_count'|'latest_release_published_at'|'contributions_count'|'created_at'} SortOptions
 * `rank` - By package rank
 * `stars` - By package stars
 * `dependents_count` - By package Dependents Count
 * `dependent_repos_count` - By the count of dependent repos that depended on the package
 * `latest_release_published_at` - By package latest release date
 * `contributions_count` - By the count of contributions to this package package
 * `created_at` - By package creation date
 */

/**
 * @typedef {Object} GetPackagesInPlatformOptions
 * @property {string} platform - Platform to get packages from (i.e NPM)
 * @property {number} totalPackages - Total packages to get
 * @property {number} startingPage - The packages fetch work with pagination (all the packages divided to "pages" for decrease send time)
 * @property {SortOptions} sortBy - On what criteria to sort by
 */

/**
 * @typedef {Object} LibrariesAPIHandlerOptions
 * @property {string} apiKey - Libraries API key
 */

// endregion

/**
 * Download script for unsupported platforms
 * @param {Array<Package>|Package[]} packages
 * @param {number} charsAmountInSingleScript
 * @return {string} The default script for unsupported platforms
 * @private
 */
function _downloadScriptForUnsupportedPlatforms(packages, charsAmountInSingleScript) {
    return `Not Supported\n${packages.map(p => p.name).join(' ')}`
}

/**
 * Divide script to chunks
 * @param {Array<Package>|Package[]} packages packages
 * @param {number} chunkSize chunk size
 * @param {function(Package): string} getPackageStr get package string
 * @param {number} totalScriptAdditionLen
 * @param {number} eachItemAdditionLen
 * @param {function(Array<string>|string[]): string} createScriptForReadyPackages
 * @return {string} The script
 *
 *
 * @example For NPM
 *
 * // `getPackageStr` function for npm with versions
 * function getPackageStr(singlePackage) {
 *     return `${singlePackage.name}@${singlePackage.latestStableReleaseNumber}`
 * }
 * // `totalScriptAdditionLen` will be
 * totalScriptAdditionLen = 'npm install '.length
 *
 * // The `eachItemAdditionLen` will be the separator length for NPM
 * // (For other platforms that need that for each package it will need to be like this `"${platform}" ` the length is 3 (quotes + space))
 * eachItemAdditionLen = ' '.length
 *
 * function createScriptForReadyPackages(packages) {
 *     return `npm install ${singleChunk.join(' ')}`
 * }
 *
 */
function divideScriptToChunk(packages, chunkSize, getPackageStr, totalScriptAdditionLen, eachItemAdditionLen, createScriptForReadyPackages) {

    const readyPackages = packages.map(getPackageStr);

    chunkSize -= totalScriptAdditionLen;

    const chunksResult = utils.splitIntoChunksBasedOnCharactersCount(readyPackages, chunkSize, (item) => item, eachItemAdditionLen);

    let script = '';

    if (chunksResult.leftOut.length > 0) {
        script += `This packages has left out because the chunk size is too small for them: ${chunksResult.leftOut.join(' ')}\n`;
    }

    script += chunksResult.chunks.map(createScriptForReadyPackages).join('\n');
    return script;
}

function getPackageName(p) {
    return p.name;
}

// noinspection JSValidateTypes
/**
 * Functions that produce the installation script based on the platform (the key)
 * @type {{[string]: function(Array<Package>|Package[], number): string}}
 */
const platformsInstallScript = {

    /**
     * Platforms that **support multi package downloading** at once
     */

    'npm': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, (p) => `${p.name}@${p.latestStableReleaseNumber}`, 12, 1, (singleChunk) => `npm install ${singleChunk.join(' ')}`),
    'Go': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 7, 1, (singleChunk) => `go get ${singleChunk.join(' ')}`),
    'Packagist': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 17, 1, (singleChunk) => `composer require ${singleChunk.join(' ')}`),
    'PyPI': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 12, 1, (singleChunk) => `pip install ${singleChunk.join(' ')}`),
    'Rubygems': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 12, 1, (singleChunk) => `gem install ${singleChunk.join(' ')}`),
    'Bower': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 14, 1, (singleChunk) => `bower install ${singleChunk.join(' ')}`),
    'Cargo': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 14, 1, (singleChunk) => `cargo install ${singleChunk.join(' ')}`),
    'Hackage': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 14, 1, (singleChunk) => `cabal install ${singleChunk.join(' ')}`),
    'Meteor': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 11, 1, (singleChunk) => `meteor add ${singleChunk.join(' ')}`),
    'Atom': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 12, 1, (singleChunk) => `apm install ${singleChunk.join(' ')}`),
    'Homebrew': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 13, 1, (singleChunk) => `brew install ${singleChunk.join(' ')}`),
    'Sublime': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 0, 1, (singleChunk) => `${singleChunk.join(',')}`),
    'Dub': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 10, 1, (singleChunk) => `dub fetch ${singleChunk.join(' ')}`),
    'Nimble': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 15, 1, (singleChunk) => `nimble install ${singleChunk.join(' ')}`),
    'Alcatraz': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, getPackageName, 10, 1, (singleChunk) => `lerna add ${singleChunk.join(' ')}`),
    'Julia': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, (p) => `"${p.name}"`, 11, 2, (singleChunk) => `Pkg.add([${singleChunk.join(', ')}])`),
    'CRAN': (packages, charsAmountInSingleScript) => divideScriptToChunk(packages, charsAmountInSingleScript, (p) => `"${p.name}"`, 21, 1, (singleChunk) => `install.packages(c(${singleChunk.join(' ')}))`),

    /**
     * Platforms that need to download **one package at a time**
     */

    'NuGet': (packages, charsAmountInSingleScript) => packages.map((pck) => `Install-Package ${pck.name}`).join('\n'),
    'PureScript': (packages, charsAmountInSingleScript) => packages.map((p) => `psc-package install ${p.name}`).join('\n'),
    'Inqlude': (packages, charsAmountInSingleScript) => packages.map((p) => `inqlude install ${p.name}`).join('\n'),
    'Racket': (packages, charsAmountInSingleScript) => packages.map((p) => `raco pkg install ${p.name}`).join('\n'),
    'Elm': (packages, charsAmountInSingleScript) => packages.map((p) => `elm install ${p.name}`).join('\n'),
    'Haxelib': (packages, charsAmountInSingleScript) => packages.map((p) => `haxelib install ${p.name}`).join('\n'),
    'PlatformIO': (packages, charsAmountInSingleScript) => packages.map((p) => `pio lib install "${p.name}"`).join('\n'),
    'CocoaPods': (packages, charsAmountInSingleScript) => packages.map((p) => `pod try ${p.name}`).join('\n'),

    /**
     * Unsupported Platforms
     */

    'Maven': _downloadScriptForUnsupportedPlatforms,
    'WordPress': _downloadScriptForUnsupportedPlatforms,
    'CPAN': _downloadScriptForUnsupportedPlatforms,
    'Clojars': _downloadScriptForUnsupportedPlatforms,
    'Hex': _downloadScriptForUnsupportedPlatforms,
    'Pub': _downloadScriptForUnsupportedPlatforms,
    'Puppet': _downloadScriptForUnsupportedPlatforms,
    'Emacs': _downloadScriptForUnsupportedPlatforms,
    'SwiftPM': _downloadScriptForUnsupportedPlatforms,
    'Carthage': _downloadScriptForUnsupportedPlatforms,
};

/**
 * create `LibrariesAPIHandler` instance
 * @param {LibrariesAPIHandlerOptions} options
 * @constructor
 */
function LibrariesAPIHandler(options) {
    this._validateOptions(options);

    this.apiKey = options.apiKey;
}

LibrariesAPIHandler.prototype = {};

/**
 * Validate the options that passed in the LibrariesAPIHandler constructor
 * @param {LibrariesAPIHandlerOptions} options
 * @private
 */
LibrariesAPIHandler.prototype._validateOptions = function (options) {
    if (!options) {
        throw {
            message: 'UserOptions can\'t be falsy'
        };
    }

    if (!options.apiKey) {
        throw {
            message: 'API key is required'
        };
    }
};

/**
 * Get packages in platform
 * @param {UserOptions} options UserOptions like in which platform to take from how many packages and more
 * @return {Promise<Array<Package>|Package[]>}
 */
LibrariesAPIHandler.prototype.getPackagesInPlatform = async function (options) {
    let popularPackagesName = [];
    let tempPagePackages;

    let total = options.totalPackages || 0;
    let page = options.startingPage || 1;

    let packagesLeft = total;

    // Check if we can finish the packages request without requesting more requests than the rate limit (60 requests/minutes)
    // Then we won't need to sleep each request
    let needToSleep = total > 6000;

    while (packagesLeft > 0) {
        tempPagePackages = await this._getPackagesInSinglePage(page, options).catch(utils.defaultErrorHandling);

        // I'm doing if and not just `tempPagePackages.slice(0, packagesLeft)`
        // because if we won't need to slice the array eventually than it's 99.6% slower doing it without the if
        tempPagePackages = (packagesLeft < tempPagePackages.length) ? tempPagePackages.slice(0, packagesLeft) : tempPagePackages;

        packagesLeft -= tempPagePackages.length;
        page++;

        popularPackagesName = popularPackagesName.concat(tempPagePackages);

        if (needToSleep && packagesLeft <= 0) {
            // Can request only 60 requests/minutes = request every second
            await utils.sleep(1000).catch(utils.defaultErrorHandling);
        }
    }

    return popularPackagesName;
};

/**
 * Get packages in specified page
 * @param {number} page Page to fetch packages from
 * @param {UserOptions} options
 * @return {Promise<Array>} Packages of the wanted page
 */
LibrariesAPIHandler.prototype._getPackagesInSinglePage = async function (page = 1, options) {

    const requestOptions = this._getLibrariesRequestOptions(page, options.platform, options.sortBy, 100);

    const res = await utils.requestWithPromise(requestOptions)
        .catch(utils.defaultErrorHandling);

    return this._parsePackagesFromResponse(res);
};

/**
 * Get the request options (for request library)
 * @param {number} page Page to fetch
 * @param {Platforms} platform Platform to fetch the packages from (i.e npm)
 * @param {SortOptions} sortType On what criteria to sort by
 * @param {number} perPage How much packages per page
 * @return {Object} Request option
 * @private
 */
LibrariesAPIHandler.prototype._getLibrariesRequestOptions = function (page, platform, sortType, perPage) {
    platform = platform || 'npm';
    sortType = sortType || 'dependents_count';
    perPage = perPage || 100;

    return {
        method: 'GET',
        url: 'https://libraries.io/api/search',
        qs: {
            api_key: this.apiKey,
            platforms: platform,
            sort: sortType,
            page: page,
            per_page: perPage
        },
        headers:
            {
                'cache-control': 'no-cache',
                Connection: 'keep-alive',
                'accept-encoding': 'gzip, deflate',
                cookie: '_libraries_session=ejk2QzhLZjdUNFFHcXdYdU5XTHUvRVlnNEFPaHJzTmlGZ29aQ01vUkJvSU4xR0VXMURxd29WaWVTMnQ0ZUVWNmI5bUtVaWJjV1NNYllmWU5JUW5TaXBKUDl1d2dzTGxFVURjYkZubnUzdGlsOFB3OU96cHRIS1pNNnp3dEd3YndzSXI4eVplYm9EdW1tVHk5MFZnbEd3PT0tLXNSeDdMN0pnblQ0M1N1NlNFUTUwM0E9PQ%3D%3D--b0aac01e1ce281f07a5dc1a977f7b7f82cef1dfe',
                Host: 'libraries.io',
                'Cache-Control': 'no-cache',
                Accept: '*/*',
            }
    };
};

/**
 * Parse the packages in the response from the API
 * @param res The response from the API
 * @return {Array<Package>|Package[]} Packages
 * @private
 */
LibrariesAPIHandler.prototype._parsePackagesFromResponse = function (res) {
    if (!res) {
        return [];
    }

    try {
        res = JSON.parse(res);
    } catch (e) {
        console.error(res);
        console.error(e);
        throw e;
    }
    return res.map(this._parsePackage);
};

/**
 * Parse Package
 * @param p Package as returned from the API
 * @return {Package|null} Package data
 * @private
 */
LibrariesAPIHandler.prototype._parsePackage = function (p) {
    if (!p) {
        return null;
    }

    return {
        name: p.name,
        platform: p.platform,
        latestStableReleaseNumber: p.latest_stable_release_number,
        latestStableReleasePublishTimestamp: utils.getUTCTimestampFromDateStr(p.latest_stable_release_published_at)
    };
};

/**
 * Create script for downloading the libraries that fetched
 * @param {Platforms} selectedPlatform Platform that the packages data from
 * @param {Array<Package>|Package[]} packagesData
 * @param {number} charsAmountInSingleScript The characters in one script
 * @return {string} Download script
 */
LibrariesAPIHandler.prototype.createDownloadLibraryScript = function (selectedPlatform, packagesData, charsAmountInSingleScript) {
    return this._getDownloadScriptForPlatform(selectedPlatform)(packagesData, charsAmountInSingleScript)
};

/**
 * Get download libraries script for specific platform
 * @param {Platforms} platformName The platform name
 * @return {(function(Array<Package>|Package[]): string)}
 * @private
 */
LibrariesAPIHandler.prototype._getDownloadScriptForPlatform = function (platformName) {
    return platformsInstallScript[platformName] || _downloadScriptForUnsupportedPlatforms;
};

module.exports = LibrariesAPIHandler;
