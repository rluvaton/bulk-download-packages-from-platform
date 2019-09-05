
const fs = require("fs");

/**
 * File System Helper
 */
const fsHelper =  {

    /**
     * Check if path exist
     * @param {string} path File/Directory Path to test
     * @return {boolean} file/directory existence
     */
    isPathExist: function (path) {
        return fs.existsSync(path);
    },

    /**
     * Check if parent folder of file/folder exists
     * @param {string} path Path to file/directory
     * @return {boolean} If parent folder existence
     */
    isParentFolderExist: function (path) {
        if (!path) {
            return false;
        }

        // If already a path
        if (path.endsWith('\\') || path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        let lastSlashIndex = Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/'));

        const parentPath = lastSlashIndex !== -1 ? path.substr(0, lastSlashIndex) : path;
        return fs.existsSync(parentPath);
    },

    /**
     * Validate path to be file or folder
     * @param {string} path Path to validate
     * @param {boolean} isFileType True to compare with file type, false for checking if directory
     * @return {boolean} If the type of a path is like `isFileType` value (true: file, false: folder)
     */
    validatePathType: function (path, isFileType) {
        const pathStat = fs.lstatSync(path);
        return isFileType ? pathStat.isFile() : pathStat.isDirectory();
    },

    /**
     * Write to file the content (Overwrite if already exist)
     * @param {string} path Path to file
     * @param content content to write in the file
     * @return {Promise}
     */
    writeFile: function (path, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
};

module.exports = fsHelper;
