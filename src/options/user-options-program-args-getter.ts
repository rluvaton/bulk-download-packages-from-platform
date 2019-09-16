// Parse command line arguments
import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import {Section} from 'command-line-usage';

import {IUserOptions, UserOptions} from './user-options';
import {BaseUserOptionsGetter} from './base-user-options-getter';
import {ScriptHandleOptions} from '../common/script-handle-options';
import {EnumValues} from 'enum-values';
import {PlatformOptions} from '../platforms/platform-options';
import {SortOptions} from '../common/sort-options';

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
      name: 'help',
      alias: 'h',
      type: Boolean,
      defaultValue: false
    },
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
    },
    {
      name: userOptionKeys.IS_GLOBAL,
      type: Boolean,
      defaultValue: defaultUserOptions.isGlobal
    }
  ];

  /**
   * Options for `command-line-usage`
   */
  private static _optionUsageDefinition = [
    {
      name: 'set-options',
      alias: 'o',
      type: Boolean,
      defaultValue: false,
      description: '{bold.red REQUIRED} if wanted to add custom options',
      group: ['required']
    },
    {
      name: 'default',
      alias: 'd',
      type: Boolean,
      defaultValue: false,
      description: 'Set the default options',
      group: ['required']
    },
    {
      name: 'help',
      alias: 'h',
      description: 'Print this usage guide.',
      group: ['basic']
    },
    {
      name: userOptionKeys.TOTAL_PACKAGES,
      type: Number,
      defaultValue: defaultUserOptions.totalPackages,
      description: 'Total packages to fetch',
      group: ['basic']
    },
    {
      name: userOptionKeys.STARTING_PAGE,
      type: Number,
      defaultValue: defaultUserOptions.startingPage,
      description: 'From which page to start fetching the packages (the packages fetching use pagination)',
      group: ['basic']
    },
    {
      name: userOptionKeys.SCRIPT_HANDLE_OPTION,
      typeLabel: '{underline \<script-handle-option\>} (written down {blue ⬇})',
      defaultValue: defaultUserOptions.scriptHandleOption,
      description: 'How to handle the download script',
      group: ['advance'],
    },
    {
      name: userOptionKeys.FILE_PATH,
      typeLabel: '{underline file}',
      defaultValue: defaultUserOptions.filePath,
      description: `File path in case that {italic ${ScriptHandleOptions.WRITE_TO_FILE}} is chosen in {italic ${userOptionKeys.SCRIPT_HANDLE_OPTION}} option`,
      group: ['advance'],
    },
    {
      name: userOptionKeys.PLATFORM,
      alias: 'p',
      typeLabel: '{underline \<platform-option\>} (written down {blue ⬇})',
      defaultValue: defaultUserOptions.platform,
      description: 'Platform to get the packages from',
      group: ['advance'],
    },
    {
      name: userOptionKeys.SORT_BY,
      typeLabel: '{underline \<sort-option\>} (written down {blue ⬇})',
      defaultValue: defaultUserOptions.sortBy,
      description: 'At which order to get the packages (i.e get from npm the packages with the top dependents count)',
      group: ['advance'],
    },
    {
      name: userOptionKeys.CHARS_AMOUNT_IN_SINGLE_SCRIPT,
      type: Number,
      defaultValue: defaultUserOptions.charsAmountInSingleScript,
      description: 'The amount of characters in single script, in some OS (ahem Windows) there is low limit for it (2047 / 8191)',
      group: ['advance'],
    },
    {
      name: userOptionKeys.IS_GLOBAL,
      type: Boolean,
      defaultValue: defaultUserOptions.isGlobal,
      description: 'Should download globally (only for supported platforms)',
      group: ['advance'],
    }
  ];
  private static _sections: Section[] = [
    {
      header: 'Bulk download packaged from platform',
      content: {
        data: [
          {col: 'Generates script from wanted platform'},
          {col: 'You can write to file or print it, get packages by some of the sort options and more!'},
          {col: '{gray (e.g top 10 packages with most dependencies count)}'},
          {col: ''},
          {col: '📌 GitHub Repo 📌 {underline https://github.com/rluvaton/bulk-download-packages-from-platform}'}
        ],
        options: {
          noTrim: true,
        }
      },
    },
    {
      header: 'Required',
      optionList: UserOptionsProgramArgsGetter._optionUsageDefinition,
      group: 'required'
    },
    {
      header: 'Basic Options',
      optionList: UserOptionsProgramArgsGetter._optionUsageDefinition,
      group: 'basic',
    },
    {
      header: 'Advance Options',
      optionList: UserOptionsProgramArgsGetter._optionUsageDefinition,
      group: 'advance',
    },
    {
      header: 'Possible Values (options)',
      content: {
        data: [
          {title: '📜  {bold Script Handle options}:', options: EnumValues.getValues(ScriptHandleOptions).map((o) => `{italic.gray ${o}}`).join(' / ')},
          {title: '📜  {bold Platform options}:     ', options: EnumValues.getValues(PlatformOptions).map((o) => `{italic.gray ${o}}`).join(' / ')},
          {title: '📜  {bold Sort options}:         ', options: EnumValues.getValues(SortOptions).map((o) => `{italic.gray ${o}}`).join(' / ')},
        ],
        options: {
          columns: [
            {
              name: 'options',
              break: false,
            }
          ],
        }
      }
    }
  ];

  /**
   * The formatted help
   */
  private static _helpStr = commandLineUsage(UserOptionsProgramArgsGetter._sections);

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
    const options: IInputUserOptions = commandLineArgs(UserOptionsProgramArgsGetter._optionDefinitions);

    return Promise.resolve(new UserOptions(options.default ? {} : options));
  }

  isRequestingHelp(): boolean {
    let options: { help?: boolean };

    try {
      options = commandLineArgs(UserOptionsProgramArgsGetter._optionDefinitions);
    } catch (e) {
      return false;
    }

    return options.help;
  }

  showHelp() {
    console.log(UserOptionsProgramArgsGetter._helpStr);
  }
}
