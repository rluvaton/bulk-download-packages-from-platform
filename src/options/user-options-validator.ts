import {IUserOptions} from './user-options';
import {isNil, isNumber, isValueExistInEnum} from '../helpers/validate-helper';
import {ScriptHandleOptions} from '../common/script-handle-options';
import {PlatformOptions} from '../platforms/platform-options';
import {SortOptions} from '../common/sort-options';
import {isParentFolderExist, isPathExist, validatePathType} from '../helpers/fs-helper';

export class UserOptionsValidator {
  private static _instance: UserOptionsValidator;

  public static get instance(): UserOptionsValidator {
    if (!this._instance) {
      this._instance = new UserOptionsValidator();
    }

    return this._instance;
  }

  private constructor() {
  }

  /**
   * Validate options (only the options that specified in the program args
   * @param options Program args options
   * @return {Promise}
   */
  async validateOptions(options: IUserOptions): Promise<IUserOptions> {
    const errors = [];

    const addToErrorArr = (err) => errors.push(err);

    await Promise.all([
      this._validateTotalPackages(options).catch(addToErrorArr),
      this._validateStartingPage(options).catch(addToErrorArr),
      this._validateScriptHandleOption(options).catch(addToErrorArr),
      this.validateFilePath(options).catch(addToErrorArr),
      this._validatePlatform(options).catch(addToErrorArr),
      this._validateSortBy(options).catch(addToErrorArr),
      this._validateCharsAmountInSingleScript(options).catch(addToErrorArr)
    ]);

    if (errors.length > 0) {
      throw {errors: errors};
    }

    return options;
  }

  public validateFilePath(options: IUserOptions): Promise<IUserOptions> {
    return new Promise((resolve, reject) => {
      try {
        this.validateFilePathSync(options);
        resolve(options);
      } catch (e) {
        reject(e);
      }
    });
  }

  public validateFilePathSync(options: IUserOptions): IUserOptions {
    if (options.scriptHandleOption === ScriptHandleOptions.WRITE_TO_FILE && !isNil(options.filePath)) {
      const {valid, error} = this._validateWriteToFilePath(options.filePath);

      if (!valid) {
        throw {message: 'File path is invalid', filePath: options.filePath, innerException: error};
      }
    }

    return options;
  }

  /**
   * Validate that the file path provided is a file and not directory and in case there is no file like that validate that the parent folder exists
   * @param filePath
   * @param throwInCaseOfInvalidPath
   * @param printOnError Whether to print the error or not
   * @return If the file valid
   */
  private _validateWriteToFilePath(filePath: string, throwInCaseOfInvalidPath: boolean = false, printOnError: boolean = false): { valid: boolean, error?: string } {
    let error: string = null;

    if (!filePath) {
      error = 'File path is falsy';
      this._handleError(throwInCaseOfInvalidPath, error, printOnError);
      return {valid: false, error};
    }

    if (isPathExist(filePath)) {
      if (!validatePathType(filePath, true)) {
        error = 'The provided path isn\'t a file path';
        this._handleError(throwInCaseOfInvalidPath, error, printOnError);
        return {valid: false, error};
      }
      return {valid: true};
    }

    if (!isParentFolderExist(filePath)) {
      error = `Parent folder of the provided path ("${filePath}") isn't exist`;
      this._handleError(throwInCaseOfInvalidPath, error, printOnError);
      return {valid: false, error};
    }

    return {valid: true};
  }

  private _handleError(shouldThrow: boolean, message: string, printOnError: boolean = false): void {
    if (shouldThrow) {
      throw {message: message};
    }

    if (printOnError) {
      console.error(message);
    }
  }

  private _validateTotalPackages(options: IUserOptions): Promise<IUserOptions> {
    return new Promise((resolve, reject) => {
      if (!isNil(options.totalPackages) && (!isNumber(options.totalPackages) || options.totalPackages <= 0)) {
        reject({message: 'Invalid total packages', totalPackages: options.totalPackages});
        return;
      }

      resolve(options);
    });
  }

  private _validateStartingPage(options: IUserOptions): Promise<IUserOptions> {
    return new Promise((resolve, reject) => {
      if (!isNil(options.startingPage) && (!isNumber(options.startingPage) || options.startingPage <= 0)) {
        reject({message: 'Invalid starting page', startingPage: options.startingPage});
        return;
      }

      resolve(options);
    });
  }

  private _validateScriptHandleOption(options: IUserOptions): Promise<IUserOptions> {
    return new Promise((resolve, reject) => {

      if (!isNil(options.scriptHandleOption) && !isValueExistInEnum(ScriptHandleOptions, options.scriptHandleOption)) {
        reject({message: 'Invalid script handle option', scriptHandleOption: options.scriptHandleOption});
        return;
      }

      resolve(options);
    });
  }

  private _validatePlatform(options: IUserOptions): Promise<IUserOptions> {
    return new Promise((resolve, reject) => {


      if (!isNil(options.platform) && !isValueExistInEnum(PlatformOptions, options.platform)) {
        reject({message: 'Invalid platform', platform: options.platform});
        return;
      }

      resolve(options);
    });
  }

  private _validateSortBy(options: IUserOptions): Promise<IUserOptions> {
    return new Promise((resolve, reject) => {

      if (!isNil(options.sortBy) && !isValueExistInEnum(SortOptions, options.sortBy)) {
        reject({message: 'Invalid sort by', sortBy: options.sortBy});
        return;
      }

      resolve(options);
    });
  }

  private _validateCharsAmountInSingleScript(options: IUserOptions): Promise<IUserOptions> {
    return new Promise((resolve, reject) => {
      if (!isNil(options.charsAmountInSingleScript) && (!isNumber(options.charsAmountInSingleScript) || options.charsAmountInSingleScript < 100)) {
        reject({message: 'Invalid Chars Amount In Single Script', charsAmountInSingleScript: options.charsAmountInSingleScript});
        return;
      }

      resolve(options);
    });
  }

}
