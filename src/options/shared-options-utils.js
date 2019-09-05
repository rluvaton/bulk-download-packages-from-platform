const fsHelper = require('../helpers/fs-helper');

function handleError(shouldThrow, message) {
    if (shouldThrow) {
        throw {message: message};
    }

    console.error(message);
}

module.exports = {
    /**
     * Validate that the file path provided is a file and not directory and in case there is no file like that validate that the parent folder exists
     * @param {string} filePath
     * @param {boolean} throwInCaseOfInvalidPath
     * @return {boolean}
     */
    validateWriteToFilePath: (filePath, throwInCaseOfInvalidPath = false) => {
        if (!filePath) {
            handleError(throwInCaseOfInvalidPath, 'File path is falsy');
            return false;
        }

        if (fsHelper.isPathExist(filePath)) {
            if (!fsHelper.validatePathType(filePath, true)) {
                handleError(throwInCaseOfInvalidPath, 'The provided path isn\'t a file path');
                return false;
            }
            return true;
        }

        if (!fsHelper.isParentFolderExist(filePath)) {
            handleError(throwInCaseOfInvalidPath, `Parent folder of the provided path ("${filePath}") isn't exist`);
            return false;
        }

        return true;
    }
};



