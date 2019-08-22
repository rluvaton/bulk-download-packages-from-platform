// This library add the environment file to the `process.env` object
// You must have .env file
require('dotenv').config();

// Npm package sizing
const getSizes = require('package-size');

// Get input from user
const prompts = require('prompts');

const Utils = require('./utils');
const LibrariesAPIHandler = require('./libraries-api-handler');

const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY;
LibrariesIoApiHandler = new LibrariesAPIHandler({
    apiKey: LIBRARIES_IO_API_KEY
});

let selectedPlatform;

function handleDownloadScript(script) {
    console.log('The script is:');
    console.log('--------------');
    console.log(script);
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
            Utils.defaultErrorHandling(err);
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
            Utils.defaultErrorHandling(err);
            return {};
        });

    const totalPackagesSize = Utils.parseBytesToHumanReadable(packagesSize.size);
    const totalPackagesSizeMinified = Utils.parseBytesToHumanReadable(packagesSize.minified);
    const totalPackagesSizeGzipped = Utils.parseBytesToHumanReadable(packagesSize.gzipped);

    console.log(`Total Packages size is ${totalPackagesSize} | Minified: ${totalPackagesSizeMinified} | Gzipped: ${totalPackagesSizeGzipped}`);
    return names;
}

function setDefaultAdvanceOptions(options) {
    options.platform = 'npm';
    options.sortBy = 'dependents_count'
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

async function getUserOptions() {
    return prompts(questions);
}

(async () => {
    const options = await getUserOptions().catch(Utils.defaultErrorHandling);

    if (!options) {
        throw {message: 'Can\'t continue no options for some reason...'};
    }

    if (!options.advanceOptions) {
        setDefaultAdvanceOptions(options);
    }

    selectedPlatform = options.platform;

    console.log('Starting...');

    LibrariesIoApiHandler.getPackagesInPlatform(options)
    // .then(printPackagesSize)
        .then((packages) => LibrariesIoApiHandler.createScriptForDownloadLibrary(selectedPlatform, packages))
        .then(handleDownloadScript)
        .catch(console.error);

})();
