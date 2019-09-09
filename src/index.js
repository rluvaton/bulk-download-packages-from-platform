// This library add the environment file to the `process.env` object
// You must have .env file
require('dotenv').config();

const fsHelper = require('./helpers/fs-helper');
const utils = require('./helpers/utils');

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
    switch (options.scriptHandleOption) {
        case 'file':
            const successfullyWriteToFile = fsHelper.writeFile(options.filePath, script)
                .then(() => true)
                .catch((err) => {
                    console.error('Error in writing to file');
                    utils.defaultErrorHandling(err);

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

function onFinish() {
    console.log('Finished!');
}

(async () => {

    const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY;
    const librariesIoApiHandler = new LibrariesAPIHandler({
        apiKey: LIBRARIES_IO_API_KEY
    });

    // noinspection JSValidateTypes
    options = await getUserOptions(process.argv).catch((err) => {
        console.error('Error in getting user options');
        utils.defaultErrorHandling(err);

        return null;
    });

    if(!options) {
        console.error('Exiting, no options due to an error');
        return;
    }

    console.log('Starting...');

    librariesIoApiHandler.getPackagesInPlatform(options)
        .then((packages) => librariesIoApiHandler.createDownloadLibraryScript(options.platform, packages, options.charsAmountInSingleScript))
        .then(handleDownloadScript)
        .then(onFinish)
        .catch(console.error);

})();
