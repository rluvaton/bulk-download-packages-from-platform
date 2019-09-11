// Parse command line arguments
import * as commandLineArgs from 'command-line-args';

import {IUserOptions, UserOptions} from './user-options';
import {BaseUserOptionsGetter} from './base-user-options-getter';

const userOptionKeys = UserOptions.objectKeys;
const defaultUserOptions = UserOptions.default;

interface IInputUserOptions extends IUserOptions {
  default: boolean;
  'set-options': boolean;
}

export class UserOptionsProgramArgsGetter extends BaseUserOptionsGetter {

  private _args;

  /**
   * Option Definition for `command-line-args` library
   */
  private static _optionDefinitions = [
    {
      name: 'default',
      alias: 'd',
      type: Boolean,
      defaultValue: false
    },
    {
      name: 'set-options',
      alias: 'o',
      type: Boolean,
      defaultValue: false
    },
    {
      name: userOptionKeys.TOTAL_PACKAGES,
      type: Number,
      defaultValue: defaultUserOptions.totalPackages
    },
    {
      name: userOptionKeys.STARTING_PAGE,
      type: Number,
      defaultValue: defaultUserOptions.startingPage
    },
    {
      name: userOptionKeys.SCRIPT_HANDLE_OPTION,
      type: String,
      defaultValue: defaultUserOptions.scriptHandleOption
    },
    {
      name: userOptionKeys.FILE_PATH,
      type: String,
      defaultValue: defaultUserOptions.filePath
    },
    {
      name: userOptionKeys.PLATFORM,
      alias: 'p',
      type: String,
      defaultValue: defaultUserOptions.platform
    },
    {
      name: userOptionKeys.SORT_BY,
      type: String,
      defaultValue: defaultUserOptions.sortBy
    },
    {
      name: userOptionKeys.CHARS_AMOUNT_IN_SINGLE_SCRIPT,
      type: Number,
      defaultValue: defaultUserOptions.charsAmountInSingleScript
    }
  ];

  constructor(programArgs) {
    super();
    this._args = programArgs;
  }

  isArgsContainOptions(): boolean {
    let options: IInputUserOptions;

    try {
      options = commandLineArgs(UserOptionsProgramArgsGetter._optionDefinitions);
    } catch (e) {
      console.error('Error at parsing program args:\n', e.message);
      return false;
    }

    if (!options || Object.keys(options).length === 0) {
      return false;
    }

    // Convert from falsy/truthy value to false/true
    return !!(options.default || options['set-options']);
  }

  _getOptions(): Promise<UserOptions> {
    const options: IInputUserOptions  = commandLineArgs(UserOptionsProgramArgsGetter._optionDefinitions);

    return Promise.resolve(new UserOptions(options.default ? {} : options));
  }
}
