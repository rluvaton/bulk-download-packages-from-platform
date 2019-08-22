const Utils = require('./utils');

// region Declaring Typing for JSDoc

/**
 * @typedef {Object} Package
 * @property {string} name - Package name (i.e react)
 * @property {string} platform - Platform that the package was taken from (i.e NPM)
 * @property {string} latestStableReleaseNumber - (i.e 1.5.1)
 * @property {number} latestStableReleasePublishTimestamp - The timestamp in UTC & milliseconds format that the version was published
 */

/**
 * @typedef SortOptions
 * @property {string} rank - By package rank
 * @property {string} stars - By package stars
 * @property {string} dependents_count - By package Dependents Count
 * @property {string} dependent_repos_count - By the count of dependent repos that depended on the package
 * @property {string} latest_release_published_at - By package latest release date
 * @property {string} contributions_count - By the count of contributions to this package package
 * @property {string} created_at - By package creation date
 *
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
 * @return {string} The default script for unsupported platforms
 * @private
 */
function _downloadScriptForUnsupportedPlatforms(packages) {
    return `Not Supported\n${packages.map(p => p.name).join(' ')}`
}

/**
 * Functions that produce the installation script based on the platform (the key)
 * @type {{[string]: function(Array<Package>|Package[]): string}}
 */
const platformsInstallScript = {
    'npm': (packages) => `npm install ${packages.map((p) => `${p.name}@${p.latestStableReleaseNumber}`).join(' ')}`,
    'Go': (packages) => `go get ${packages.map(p => p.name).join(' ')}`,
    'Packagist': (packages) => `composer require ${packages.map(p => p.name).join(' ')}`,
    'PyPI': (packages) => `pip install ${packages.map(p => p.name).join(' ')}`,
    'NuGet': (packages) => packages.map((pck) => `Install-Package ${pck.name}`).join('\n'),
    'Rubygems': (packages) => `gem install ${packages.map(p => p.name).join(' ')}`,
    'Bower': (packages) => `bower install ${packages.map(p => p.name).join(' ')}`,
    'CocoaPods': (packages) => packages.map((p) => `pod try ${p.name}`).join('\n'),
    'Cargo': (packages) => `cargo install ${packages.map(p => p.name).join(' ')}`,
    'CRAN': (packages) => `install.packages(c(${packages.map((p) => `"${p.name}"`).join(' ')}))`,
    'Hackage': (packages) => `cabal install ${packages.map(p => p.name).join(' ')}`,
    'Meteor': (packages) => `meteor add ${packages.map(p => p.name).join(' ')}`,
    'Atom': (packages) => `apm install ${packages.map(p => p.name).join(' ')}`,
    'PlatformIO': (packages) => packages.map((p) => `pio lib install "${p.name}"`).join('\n'),
    'Homebrew': (packages) => `brew install ${packages.map(p => p.name).join(' ')}`,
    'Julia': (packages) => `Pkg.add([${packages.map((p) => `"${p.name}"`).join(', ')}])`,
    'Sublime': (packages) => `${packages.map(p => p.name).join(',')}`,
    'Dub': (packages) => `dub fetch ${packages.map(p => p.name).join(' ')}`,
    'Racket': (packages) => packages.map((p) => `raco pkg install ${p.name}`).join('\n'),
    'Elm': (packages) => packages.map((p) => `elm install ${p.name}`).join('\n'),
    'Haxelib': (packages) => packages.map((p) => `haxelib install ${p.name}`).join('\n'),
    'Nimble': (packages) => `nimble install ${packages.map(p => p.name).join(' ')}`,
    'Alcatraz': (packages) => `lerna add ${packages.map(p => p.name).join(' ')}`,
    'PureScript': (packages) => packages.map((p) => `psc-package install ${p.name}`).join('\n'),
    'Inqlude': (packages) => packages.map((p) => `inqlude install ${p.name}`).join('\n'),

    // Unsupported Platforms
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
            message: 'Options can\'t be falsy'
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
 * @param {GetPackagesInPlatformOptions} options Options like in which platform to take from how many packages and more
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
        tempPagePackages = await this._getPackagesInSinglePage(page, options).catch(Utils.defaultErrorHandling);

        // I'm doing if and not just `tempPagePackages.slice(0, packagesLeft)`
        // because if we won't need to slice the array eventually than it's 99.6% slower doing it without the if
        tempPagePackages = (packagesLeft < tempPagePackages.length) ? tempPagePackages.slice(0, packagesLeft) : tempPagePackages;

        packagesLeft -= tempPagePackages.length;
        page++;

        popularPackagesName = popularPackagesName.concat(tempPagePackages);

        if (needToSleep && packagesLeft <= 0) {
            // Can request only 60 requests/minutes = request every second
            await Utils.sleep(1000).catch(Utils.defaultErrorHandling);
        }
    }

    return popularPackagesName;
};

/**
 * Get packages in specified page
 * @param {number} page Page to fetch packages from
 * @param {GetPackagesInPlatformOptions} options
 * @return {Promise<Array>} Packages of the wanted page
 */
LibrariesAPIHandler.prototype._getPackagesInSinglePage = async function (page = 1, options) {

    const requestOptions = this._getLibrariesRequestOptions(page, options.platform, options.sortBy, 100);

    const res = await Utils.requestWithPromise(requestOptions)
        .catch(Utils.defaultErrorHandling);

    return this._parsePackagesFromResponse(res);
};

/**
 * Get the request options (for request library)
 * @param {number} page Page to fetch
 * @param {string} platform Platform to fetch the packages from (i.e npm)
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

    res = JSON.parse(res);

    return res.map(this._parsePackage);
};

/**
 * Parse Package
 * @param {Object} p Package as returned from the API
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
        latestStableReleasePublishTimestamp: Utils.getUTCTimestampFromDateStr(p.latest_stable_release_published_at)
    };
};

/**
 * Create script for downloading the libraries that fetched
 * @param {string} selectedPlatform Platform that the packages data from
 * @param {Array<Package>|Package[]} packagesData
 * @return {string} download script
 */
LibrariesAPIHandler.prototype.createDownloadLibraryScript = function (selectedPlatform, packagesData) {
    return this._getDownloadScriptForPlatform(selectedPlatform)(packagesData)
};

/**
 * Get download libraries script for specific platform
 * @param {string} platformName The platform name
 * @return {(function(Array<Package>|Package[]): string)}
 * @private
 */
LibrariesAPIHandler.prototype._getDownloadScriptForPlatform = function (platformName) {
    return platformsInstallScript[platformName] || _downloadScriptForUnsupportedPlatforms;
};

module.exports = LibrariesAPIHandler;
