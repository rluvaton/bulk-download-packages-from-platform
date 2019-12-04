import {PlatformOptions} from '../platforms/platform-options';
import {SortOptions} from '../common/sort-options';
import {ScriptHandleOptions} from '../common/script-handle-options';
import {isNil} from '../helpers/validate-helper';

export interface IUserOptions {
  /**
   * Total packages to fetch
   * @default 100
   */
  totalPackages: number;

  /**
   * From which page to start fetching packages
   * @default 1
   */
  startingPage: number;

  /**
   * How to handle the script
   * @default ScriptHandleOptions.WRITE_TO_FILE
   */
  scriptHandleOption: ScriptHandleOptions;

  /**
   * File path in case that `file` is chosen in `scriptHandleOptions` option
   * @default './packages-download-script.bat'
   */
  filePath?: string;

  /**
   * Platform to get the packages from
   * @default PlatformOptions.NPM
   */
  platform: PlatformOptions;

  /**
   * At which order to get the packages (i.e get from npm the packages with the top dependents count)
   * @default SortOptions.DEPENDENTS_COUNT
   */
  sortBy: SortOptions;

  /**
   * The amount of characters in single script
   * @default defaultOptions.charsAmountInSingleScript
   */
  charsAmountInSingleScript: number;

  /**
   * Should download globally (only for supported platforms)
   * @default false
   */
  isGlobal: boolean;

  /**
   * Show progress while fetching libraries
   * @default true
   */
  showProgress: boolean;
}

export class UserOptions implements IUserOptions {

  public static readonly objectKeys = {
    TOTAL_PACKAGES: 'totalPackages',
    STARTING_PAGE: 'startingPage',
    ADVANCE_OPTIONS: 'advanceOptions',
    SCRIPT_HANDLE_OPTION: 'scriptHandleOption',
    FILE_PATH: 'filePath',
    PLATFORM: 'platform',
    SORT_BY: 'sortBy',
    CHARS_AMOUNT_IN_SINGLE_SCRIPT: 'charsAmountInSingleScript',
    IS_GLOBAL: 'isGlobal',
    SHOW_PROGRESS: 'showProgress'
  };

  public static readonly default = new UserOptions(null);

  /**
   * Total packages to fetch
   * @default 100
   */
  private _totalPackages: number;

  /**
   * From which page to start fetching packages
   * @default 1
   */
  private _startingPage: number;

  /**
   * How to handle the script
   * @default ScriptHandleOptions.WRITE_TO_FILE
   */
  private _scriptHandleOption: ScriptHandleOptions;

  /**
   * File path in case that `file` is chosen in `scriptHandleOptions` option
   * @default './packages-download-script.bat'
   */
  private _filePath?: string;

  /**
   * Platform to get the packages from
   * @default PlatformOptions.NPM
   */
  private _platform: PlatformOptions;

  /**
   * At which order to get the packages (i.e get from npm the packages with the top dependents count)
   * @default SortOptions.DEPENDENTS_COUNT
   */
  private _sortBy: SortOptions;

  /**
   * The amount of characters in single script
   * @default defaultOptions.charsAmountInSingleScript
   */
  private _charsAmountInSingleScript: number;

  private _isGlobal: boolean;

  private _showProgress: boolean;


  constructor(options?: IUserOptions | any) {
    options = options || {};

    this.totalPackages = options.totalPackages;
    this.startingPage = options.startingPage;
    this.scriptHandleOption = options.scriptHandleOption;
    this.filePath = options.filePath;
    this.platform = options.platform;
    this.sortBy = options.sortBy;
    this.charsAmountInSingleScript = options.charsAmountInSingleScript;
    this.isGlobal = options.isGlobal;
    this.showProgress = options.showProgress;
  }

  get totalPackages(): number {
    return this._totalPackages;
  }

  set totalPackages(value: number) {
    this._totalPackages = value > 0 ? value : 100;
  }

  get startingPage(): number {
    return this._startingPage;
  }

  set startingPage(value: number) {
    this._startingPage = value > 0 ? value : 1;

  }

  get scriptHandleOption(): ScriptHandleOptions {
    return this._scriptHandleOption;
  }

  set scriptHandleOption(value: ScriptHandleOptions) {
    this._scriptHandleOption = value || ScriptHandleOptions.WRITE_TO_FILE;
  }

  get filePath(): string {
    return this._filePath;
  }

  set filePath(value: string) {
    this._filePath = value || './packages-download-script.bat';
  }

  get platform(): PlatformOptions {
    return this._platform;
  }

  set platform(value: PlatformOptions) {
    this._platform = value || PlatformOptions.NPM;
  }

  get sortBy(): SortOptions {
    return this._sortBy;
  }

  set sortBy(value: SortOptions) {
    this._sortBy = value || SortOptions.DEPENDENTS_COUNT;
  }

  get charsAmountInSingleScript(): number {
    return this._charsAmountInSingleScript;
  }

  set charsAmountInSingleScript(value: number) {
    this._charsAmountInSingleScript = value || 2047;
  }

  get isGlobal(): boolean {
    return this._isGlobal;
  }

  set isGlobal(value: boolean) {
    this._isGlobal = !isNil(value) ? value : false;
  }

  get showProgress(): boolean {
    return this._showProgress;
  }

  set showProgress(value: boolean) {
    this._showProgress = !isNil(value) ? value : true;
  }
}
