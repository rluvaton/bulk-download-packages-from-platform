// Npm package sizing
const getSizes = require('package-size');

const request = require("request");

// Color the command line output
const chalk = require('chalk');

// Get input from command line
const prompts = require('prompts');

const LIBRARIES_IO_API_KEY = '<insert api key here>';

function defaultErrorHandling(err) {
    console.error(err);
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


/**
 *
 * @param {{platform: string, totalPackages: number, startingPage: number, sortBy: string}} options
 * @return {Promise<Array|*[]>}
 */
async function getPopularPackagesInPlatform(options) {
    let popularPackagesName = [];
    let tempPagePackages;

    let total = options.totalPackages || 0;
    let page = options.startingPage || 1;

    let packagesLeft = total;

    let needToSleep = total > 6000;

    while (packagesLeft > 0) {
        tempPagePackages = await getPopularPackagesInSinglePage(page, options).catch(defaultErrorHandling);

        // I'm doing if and not just `tempPagePackages.slice(0, packagesLeft)`
        // because if we won't need to slice the array eventually than it's 99.6% slower doing it without the if
        tempPagePackages = (packagesLeft < tempPagePackages.length) ? tempPagePackages.slice(0, packagesLeft) : tempPagePackages;

        packagesLeft -= tempPagePackages.length;
        page++;

        popularPackagesName = popularPackagesName.concat(tempPagePackages);

        if (needToSleep) {
            // Can request only 60 requests/minutes = request every second
            await sleep(1000).catch(defaultErrorHandling);
        }
    }

    return popularPackagesName;
}

function getPackagesNameFromResponse(res) {
    if (!res) {
        return [];
    }

    res = JSON.parse(res);

    return res.map((packageData) => packageData.name);
}

function getLibrariesRequestOptions(page, platform, sortType, perPage) {
    platform = platform || 'npm';
    sortType = sortType || 'dependents_count';
    perPage = perPage || 100;

    return {
        method: 'GET',
        url: 'https://libraries.io/api/search',
        qs: {
            api_key: LIBRARIES_IO_API_KEY,
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
}

/**
 *
 * @param page
 * @param {{platform: string, totalPackages: number, startingPage: number, sortBy: string}} options
 * @return {Promise<Array>}
 */
async function getPopularPackagesInSinglePage(page = 1, options) {

    const requestOptions = getLibrariesRequestOptions(page, options.platform, options.sortBy, 100);

    const res = await requestWithPromise(requestOptions)
        .catch(defaultErrorHandling);

    return getPackagesNameFromResponse(res);
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

function createScriptForDownload(packagesName) {
    return `npm install ${packagesName.join(' ')}`
}

function handleDownloadScript(script) {
    console.log('The script is:');
    console.log('--------------');
    console.log(script);
}

function humanFileSize(bytes, si) {
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
 * Get package(s) size from it's name(s)
 * @param names Package(s) name - can be string or array of names
 * @return Package name in bytes
 */
async function getPackageSizeFromNameInBytes(names) {
    names = Array.isArray(names) ? names.join(',') : names;

    const sizeData = await getSizes(names)
        .catch((err) => {
            defaultErrorHandling(err);
            return {};
        });

    return {
        size: sizeData.size,
        minified: sizeData.minified,
        gzipped: sizeData.gzipped,
    };
}

async function printPackagesSize(names) {
    const packagesSize = await getPackageSizeFromNameInBytes(names)
        .catch((err) => {
            defaultErrorHandling(err);
            return {};
        });

    const totalPackagesSize = humanFileSize(packagesSize.size);
    const totalPackagesSizeMinified = humanFileSize(packagesSize.minified);
    const totalPackagesSizeGzipped = humanFileSize(packagesSize.gzipped);

    console.log(`Total Packages size is ${totalPackagesSize} | Minified: ${totalPackagesSizeMinified} | Gzipped: ${totalPackagesSizeGzipped}`);
    return names;
}

const questions = [
    {
        type: 'number',
        name: 'totalPackages',
        message: 'How many packages do you want?',
        initial: 100,
        min: 1
    },
    {
        type: 'number',
        name: 'startingPage',
        message: 'From which page do you wanna start? (default is 1)',
        initial: 1,
        min: 1
    },
    {
        type: 'confirm',
        name: 'advanceOptions',
        message: 'Enter advance options?',
        initial: false
    },
    {
        type: (prev) => prev ? 'select' : null,
        name: 'platform',
        message: 'Choose platform',
        choices: [
            {title: 'npm', value: 'npm'},
            {title: 'Go', value: 'Go'},
            {title: 'Packagist', value: 'Packagist'},
            {title: 'PyPI', value: 'PyPI'},
            {title: 'Maven', value: 'Maven'},
            {title: 'NuGet', value: 'NuGet'},
            {title: 'Rubygems', value: 'Rubygems'},
            {title: 'Bower', value: 'Bower'},
            {title: 'WordPress', value: 'WordPress'},
            {title: 'CocoaPods', value: 'CocoaPods'},
            {title: 'CPAN', value: 'CPAN'},
            {title: 'Cargo', value: 'Cargo'},
            {title: 'Clojars', value: 'Clojars'},
            {title: 'CRAN', value: 'CRAN'},
            {title: 'Hackage', value: 'Hackage'},
            {title: 'Meteor', value: 'Meteor'},
            {title: 'Atom', value: 'Atom'},
            {title: 'Hex', value: 'Hex'},
            {title: 'Pub', value: 'Pub'},
            {title: 'PlatformIO', value: 'PlatformIO'},
            {title: 'Puppet', value: 'Puppet'},
            {title: 'Emacs', value: 'Emacs'},
            {title: 'Homebrew', value: 'Homebrew'},
            {title: 'SwiftPM', value: 'SwiftPM'},
            {title: 'Carthage', value: 'Carthage'},
            {title: 'Julia', value: 'Julia'},
            {title: 'Sublime', value: 'Sublime'},
            {title: 'Dub', value: 'Dub'},
            {title: 'Racket', value: 'Racket'},
            {title: 'Elm', value: 'Elm'},
            {title: 'Haxelib', value: 'Haxelib'},
            {title: 'Nimble', value: 'Nimble'},
            {title: 'Alcatraz', value: 'Alcatraz'},
            {title: 'PureScript', value: 'PureScript'},
            {title: 'Inqlude', value: 'Inqlude'}
        ],
        initial: 0,
    },
    {
        type: (prev) => prev ? 'select' : null,
        name: 'sortBy',
        message: 'Choose what is the sort parameter',
        choices: [
            {title: 'Rank', value: 'rank'},
            {title: 'Stars', value: 'stars'},
            {title: 'Dependents Count', value: 'dependents_count'},
            {title: 'Dependent Repos Count', value: 'dependent_repos_count'},
            {title: 'Latest Release Published At', value: 'latest_release_published_at'},
            {title: 'Contributions Count', value: 'contributions_count'},
            {title: 'Created At', value: 'created_at'}
        ],
        initial: 2,
    }
];

function setDefaultAdvanceOptions(options) {
    options.platform = 'npm';
    options.sortBy = 'dependents_count'
}

(async () => {
    const options = await prompts(questions).catch(defaultErrorHandling);

    if (!options) {
        throw {message: 'Can\'t continue'};
    }

    if(!options.advanceOptions) {
        setDefaultAdvanceOptions(options);
    }

    getPopularPackagesInPlatform(options)
    // .then(printPackagesSize)
        .then(createScriptForDownload)
        .then(handleDownloadScript)
        .catch(console.error);

})();





