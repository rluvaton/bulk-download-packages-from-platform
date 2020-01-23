// This library add the environment file to the `process.env` object
// You must have .env file
import {config} from 'dotenv';
import {writeFile} from './helpers/fs-helper';
import {defaultErrorHandling} from './helpers/utils';
import {LibrariesAPIHandler} from './libraries-api/libraries-api-handler';

import {getUserOptions} from './options/user-options-handler';
import {UserOptions} from './options/user-options';
import {platformFactory} from './platforms/platform-factory';
import {BasePlatform} from './platforms/base-platform';
import {ProgressAdapter} from './progress-adapter';
import {Observable, Subscription} from 'rxjs';
import {first, flatMap, tap} from 'rxjs/operators';
import {PackagesGetterProgressInfo} from './common/progress/packages-getter-progress-info';
import {Package} from './common/package';

config();

class BulkDownloadPackagesFromPlatform {

  private _options: UserOptions;
  private _librariesIoApiHandler: LibrariesAPIHandler;

  private _showProgress: boolean;
  private _packagesProgressBar: ProgressAdapter = new ProgressAdapter();
  private _progressPackageSubscription: Subscription;

  constructor() {
    this._initLibrariesApiHandler();
  }

  public async run() {
    if (!this._librariesIoApiHandler) {
      this._initLibrariesApiHandler();
    }

    try {
      this._options = await getUserOptions(process.argv);
    } catch (err) {
      this.handleGetUserOptionError(err);
      return;
    }

    console.log('Starting...');

    this._showProgress = this._options.showProgress;
    if (this._showProgress) {
      this._startProgress();
    }

    const platform: BasePlatform = platformFactory(this._options.platform);
    let packages: Package[];

    try {
      packages = await this._librariesIoApiHandler.getPackagesInPlatform(this._options);
    } catch (e) {
      console.error('Error in getting packages', e);
      throw e;
    }

    let script: string;
    try {
      script = platform.createDownloadScript(packages, this._options.charsAmountInSingleScript, this._options.isGlobal, 'call');
    } catch (e) {
      console.error('Error in creating download script', e);
      throw e;
    }

    this._handleDownloadScript(script)
      .then(this._onFinish)
      .catch(console.error);


  }

  private handleGetUserOptionError(err): void {
    if (err.name === 'help-request') {
      return;
    }

    console.error('Error in getting user options', err);
    console.error('\nExiting...');
  }

  private async _startProgress() {
    const progressChangeObs: Observable<PackagesGetterProgressInfo> = this._librariesIoApiHandler.progressChangeObs;

    this._progressPackageSubscription = progressChangeObs
      .pipe(
        // Get only the first value only to start the progress bar
        first(),
        tap((firstProgressInfo) => this._packagesProgressBar.start(firstProgressInfo)),

        // Do this to jump over the first emitted value and do different function
        // Do this instead of 1 subscribe and if inside so it won't check every time if it's the first value which should is faster
        flatMap(() => progressChangeObs)
      ).subscribe({
        next: (progressInfo) => this._packagesProgressBar.updateProgress(progressInfo),
        complete: () => this._packagesProgressBar.finishProgress()
      });
  }

  private _initLibrariesApiHandler(): void {
    const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY;
    if (LIBRARIES_IO_API_KEY) {
      this._librariesIoApiHandler = new LibrariesAPIHandler({
        apiKey: LIBRARIES_IO_API_KEY
      });
    }
  }

  private _onFinish = (): void => {
    if (this._showProgress) {
      this._progressPackageSubscription.unsubscribe();
      this._progressPackageSubscription = null;
    }

    console.log('Finished!');
  };

  private _printDownloadScript(script: string): void {
    console.log('The script is:');
    console.log('--------------');
    console.log(script);
  }

  /**
   * Handle download script based on the `options.scriptHandleOptions`
   * @param script the download script
   * @return Promise with nothing
   */
  private _handleDownloadScript = async (script: string): Promise<void> => {
    switch (this._options.scriptHandleOption) {
      case 'file':
        const successfullyWriteToFile = writeFile(this._options.filePath, script)
          .then(() => true)
          .catch((err) => {
            console.error('Error in writing to file');
            defaultErrorHandling(err);

            return false;
          });

        if (successfullyWriteToFile) {
          break;
        }

      // Fall through if error in writing to file
      case 'print':
        this._printDownloadScript(script);
        break;
    }
  };

}

new BulkDownloadPackagesFromPlatform().run();


