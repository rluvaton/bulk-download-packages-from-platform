// This library add the environment file to the `process.env` object
// You must have .env file
require('dotenv').config();

// Npm package sizing
const getSizes = require('package-size');

const Utils = require('./utils');
const LibrariesAPIHandler = require('./libraries-api-handler');

const {getUserOptions} = require('./options/user-options-handler');
const UserOptions = require('./options/user-options');

/**
 * @type {UserOptions}
 */
let options;

/**
 * Handle download script based on the `options.scriptHandleOptions`
 * @param {string} script the download script
 * @return {Promise<void>}
 */
async function handleDownloadScript(script) {
    switch (options.scriptHandleOptions) {
        case 'file':
            const successfullyWriteToFile = Utils.writeFile(options.filePath, script)
                .then(() => true)
                .catch((err) => {
                    console.error('Error in writing to file');
                    Utils.defaultErrorHandling(err);

                    return false;
                });

            if (successfullyWriteToFile) {
                break;
            }

            // Fall through if error in writing to file
        case 'print':
            printDownloadScript(script);
            break;
    }
}

function printDownloadScript(script) {
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

/**
 * Print Package Size
 * @param packages Packages
 * @return {Promise<*>}
 */
async function printPackagesSize(packages) {
    const packagesSize = await getPackageSizeFromNameInBytes(packages.map((p) => p.name))
        .catch((err) => {
            Utils.defaultErrorHandling(err);
            return {};
        });

    const totalPackagesSize = Utils.parseBytesToHumanReadable(packagesSize.size);
    const totalPackagesSizeMinified = Utils.parseBytesToHumanReadable(packagesSize.minified);
    const totalPackagesSizeGzipped = Utils.parseBytesToHumanReadable(packagesSize.gzipped);

    console.log(`Total Packages size is ${totalPackagesSize} | Minified: ${totalPackagesSizeMinified} | Gzipped: ${totalPackagesSizeGzipped}`);
    return packages;
}

function onFinish() {
    console.log('Finished!');
}

(async () => {

    const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY;
    const librariesIoApiHandler = new LibrariesAPIHandler({
        apiKey: LIBRARIES_IO_API_KEY
    });

    /**
     * Options
     * @type {UserOptions}
     */
    options = await getUserOptions(process.argv).catch((err) => {
        Utils.defaultErrorHandling(err);
        return new UserOptions(null);
    });

    console.log('Starting...');

    librariesIoApiHandler.getPackagesInPlatform(options)
    // .then(printPackagesSize)
        .then((packages) => librariesIoApiHandler.createDownloadLibraryScript(options.platform, packages))
        .then(handleDownloadScript)
        .then(onFinish)
        .catch(console.error);

})();
