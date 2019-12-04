import {BaseUserOptionsGetter} from './base-user-options-getter';
import * as prompts from 'prompts';
import {IUserOptions, UserOptions} from './user-options';
import {ScriptHandleOptions} from '../common/script-handle-options';
import {PlatformOptions} from '../platforms/platform-options';
import {SortOptions} from '../common/sort-options';
import {UserOptionsValidator} from './user-options-validator';
import {platformFactory} from '../platforms/platform-factory';

const userOptionKeys = UserOptions.objectKeys;
const defaultUserOptions = UserOptions.default;

interface Choice<T, V> {
  title: T;
  value: V;
}

export class UserOptionsInputGetter extends BaseUserOptionsGetter {

  // region Input Questions related

  private static readonly _scriptHandleOptionsChoices: Choice<string, ScriptHandleOptions>[] = [
    {title: 'Print it', value: ScriptHandleOptions.PRINT},
    {title: 'Write to file', value: ScriptHandleOptions.WRITE_TO_FILE},
  ];

  private static readonly _sortByChoices: Choice<string, SortOptions>[] = [
    {title: SortOptions.RANK, value: SortOptions.RANK},
    {title: SortOptions.STARS, value: SortOptions.STARS},
    {title: SortOptions.DEPENDENTS_COUNT, value: SortOptions.DEPENDENTS_COUNT},
    {title: SortOptions.DEPENDENT_REPOS_COUNT, value: SortOptions.DEPENDENT_REPOS_COUNT},
    {title: SortOptions.LATEST_RELEASE_PUBLISHED_AT, value: SortOptions.LATEST_RELEASE_PUBLISHED_AT},
    {title: SortOptions.CONTRIBUTIONS_COUNT, value: SortOptions.CONTRIBUTIONS_COUNT},
    {title: SortOptions.CREATED_AT, value: SortOptions.CREATED_AT}
  ];

  private static readonly _platformChoices: Choice<string, PlatformOptions>[] = [
    {title: PlatformOptions.NPM, value: PlatformOptions.NPM},
    {title: PlatformOptions.GO, value: PlatformOptions.GO},
    {title: PlatformOptions.PACKAGIST, value: PlatformOptions.PACKAGIST},
    {title: PlatformOptions.PYPI, value: PlatformOptions.PYPI},
    {title: PlatformOptions.MAVEN, value: PlatformOptions.MAVEN},
    {title: PlatformOptions.NUGET, value: PlatformOptions.NUGET},
    {title: PlatformOptions.RUBYGEMS, value: PlatformOptions.RUBYGEMS},
    {title: PlatformOptions.BOWER, value: PlatformOptions.BOWER},
    {title: PlatformOptions.WORD_PRESS, value: PlatformOptions.WORD_PRESS},
    {title: PlatformOptions.COCOA_PODS, value: PlatformOptions.COCOA_PODS},
    {title: PlatformOptions.CPAN, value: PlatformOptions.CPAN},
    {title: PlatformOptions.CARGO, value: PlatformOptions.CARGO},
    {title: PlatformOptions.CLOJARS, value: PlatformOptions.CLOJARS},
    {title: PlatformOptions.CRAN, value: PlatformOptions.CRAN},
    {title: PlatformOptions.HACKAGE, value: PlatformOptions.HACKAGE},
    {title: PlatformOptions.METEOR, value: PlatformOptions.METEOR},
    {title: PlatformOptions.ATOM, value: PlatformOptions.ATOM},
    {title: PlatformOptions.HEX, value: PlatformOptions.HEX},
    {title: PlatformOptions.PUB, value: PlatformOptions.PUB},
    {title: PlatformOptions.PLATFORM_IO, value: PlatformOptions.PLATFORM_IO},
    {title: PlatformOptions.PUPPET, value: PlatformOptions.PUPPET},
    {title: PlatformOptions.EMACS, value: PlatformOptions.EMACS},
    {title: PlatformOptions.HOMEBREW, value: PlatformOptions.HOMEBREW},
    {title: PlatformOptions.SWIFT_PM, value: PlatformOptions.SWIFT_PM},
    {title: PlatformOptions.CARTHAGE, value: PlatformOptions.CARTHAGE},
    {title: PlatformOptions.JULIA, value: PlatformOptions.JULIA},
    {title: PlatformOptions.SUBLIME, value: PlatformOptions.SUBLIME},
    {title: PlatformOptions.DUB, value: PlatformOptions.DUB},
    {title: PlatformOptions.RACKET, value: PlatformOptions.RACKET},
    {title: PlatformOptions.ELM, value: PlatformOptions.ELM},
    {title: PlatformOptions.HAXELIB, value: PlatformOptions.HAXELIB},
    {title: PlatformOptions.NIMBLE, value: PlatformOptions.NIMBLE},
    {title: PlatformOptions.ALCATRAZ, value: PlatformOptions.ALCATRAZ},
    {title: PlatformOptions.PURE_SCRIPT, value: PlatformOptions.PURE_SCRIPT},
    {value: PlatformOptions.INQLUDE, title: PlatformOptions.INQLUDE}
  ];

  /**
   * Configuration questions
   */
  private static readonly _questions: Array<prompts.PromptObject<string>> = [
    {
      type: 'number',
      name: userOptionKeys.TOTAL_PACKAGES,
      message: 'How many packages do you want?',
      initial: defaultUserOptions[userOptionKeys.TOTAL_PACKAGES],
      min: 1
    },
    {
      type: 'number',
      name: userOptionKeys.CHARS_AMOUNT_IN_SINGLE_SCRIPT,
      message: 'The amount of characters in single script (Some OS have low limit)',
      initial: defaultUserOptions[userOptionKeys.CHARS_AMOUNT_IN_SINGLE_SCRIPT],
      min: 100
    },
    {
      type: 'number',
      name: userOptionKeys.STARTING_PAGE,
      message: 'From which page do you wanna start? (default is 1)',
      initial: defaultUserOptions[userOptionKeys.STARTING_PAGE],
      min: 1
    },
    {
      type: 'confirm',
      name: userOptionKeys.ADVANCE_OPTIONS,
      message: 'Enter advance options?',
      initial: defaultUserOptions[userOptionKeys.ADVANCE_OPTIONS]
    },
    {
      type: (prev, values) => values[userOptionKeys.ADVANCE_OPTIONS] ? 'select' : null,
      name: userOptionKeys.SCRIPT_HANDLE_OPTION,
      message: 'How do you want to handle the script?',
      choices: UserOptionsInputGetter._scriptHandleOptionsChoices,
      initial: UserOptionsInputGetter._getInitialIndexFromChoicesAndName(userOptionKeys.SCRIPT_HANDLE_OPTION, UserOptionsInputGetter._scriptHandleOptionsChoices),
    },
    {
      type: (prev) => prev === ScriptHandleOptions.WRITE_TO_FILE ? 'text' : null,
      name: userOptionKeys.FILE_PATH,
      message: 'Please Enter the file path you want to add',
      validate: (path: string, values: IUserOptions) => {
        let result: boolean | string;

        try {
          const options: IUserOptions = {...values};
          options.filePath = path;

          UserOptionsValidator.instance.validateFilePathSync(options);

          result = true;
        } catch (error) {
          result = error.message + ((error.innerException) ? ': ' + error.innerException : '');
        }

        return result;
      },
      initial: defaultUserOptions[userOptionKeys.FILE_PATH]
    },
    {
      type: (prev, values) => values[userOptionKeys.ADVANCE_OPTIONS] ? 'select' : null,
      name: userOptionKeys.PLATFORM,
      message: 'Choose platform',
      choices: UserOptionsInputGetter._platformChoices,
      initial: UserOptionsInputGetter._getInitialIndexFromChoicesAndName(userOptionKeys.PLATFORM, UserOptionsInputGetter._platformChoices),
    },
    {
      type: (prev, values) => values[userOptionKeys.ADVANCE_OPTIONS] ? 'select' : null,
      name: userOptionKeys.SORT_BY,
      message: 'Choose what is the sort parameter',
      choices: UserOptionsInputGetter._sortByChoices,
      initial: UserOptionsInputGetter._getInitialIndexFromChoicesAndName(userOptionKeys.SORT_BY, UserOptionsInputGetter._sortByChoices),
    },
    {
      type: (prev, values) => UserOptionsInputGetter._shouldShowGlobalOption(values) ? 'confirm' : null,
      name: userOptionKeys.IS_GLOBAL,
      message: 'Should download packages globally',
      initial: defaultUserOptions[userOptionKeys.IS_GLOBAL]
    },
    {
      type: (prev, values) => values[userOptionKeys.ADVANCE_OPTIONS] ? 'confirm' : null,
      name: userOptionKeys.SHOW_PROGRESS,
      message: 'Show progress of package fetching?',
      initial: defaultUserOptions[userOptionKeys.SHOW_PROGRESS]
    }
  ];

  private static _shouldShowGlobalOption(values): boolean {
    return values[userOptionKeys.PLATFORM] && platformFactory(values[userOptionKeys.PLATFORM]).isGlobalSupported;
  }

  /**
   * Get the index of the initial value in the choices
   * @param {string} userOptionKey The
   * @param {Array<{value: string|title: string}>|{value: string|title: string}[]} choices
   * @return {number} Index of the initial choice
   */
  private static _getInitialIndexFromChoicesAndName(userOptionKey: string, choices: { title: any, value: any }[]) {
    const initialValue = defaultUserOptions[userOptionKey];
    return choices.findIndex((choice) => choice.value === initialValue);
  }

  // endregion

  _getOptions(): Promise<UserOptions> {
    return prompts(UserOptionsInputGetter._questions).then((options) => new UserOptions(options));
  }

}
