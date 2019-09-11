import {existsSync, lstatSync, writeFile as fsWriteFile} from 'fs';

/**
 * Check if path exist
 * @param path File/Directory Path to test
 * @return file/directory existence
 */
export function isPathExist(path: string): boolean {
  return existsSync(path);
}

/**
 * Check if parent folder of file/folder exists
 * @param path Path to file/directory
 * @return If parent folder existence
 */
export function isParentFolderExist(path: string): boolean {
  if (!path) {
    return false;
  }

  // If already a path
  if (path.endsWith('\\') || path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  const lastSlashIndex = Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/'));

  const parentPath = lastSlashIndex !== -1 ? path.substr(0, lastSlashIndex) : path;
  return existsSync(parentPath);
}

/**
 * Validate path to be file or folder
 * @param path Path to validate
 * @param isFileType True to compare with file type, false for checking if directory
 * @return If the type of a path is like `isFileType` value (true: file, false: folder)
 *
 * @todo Change `isFileType` parameter to enum or string list ('file' | 'folder')
 */
export function validatePathType(path: string, isFileType: boolean): boolean {
  const pathStat = lstatSync(path);
  return isFileType ? pathStat.isFile() : pathStat.isDirectory();
}

/**
 * Write to file the content (Overwrite if already exist)
 * @param path Path to file
 * @param content content to write in the file
 * @return Promise with nothing as value
 */
export function writeFile(path: string, content: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fsWriteFile(path, content, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}
