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

config();

class BulkDownloadPackagesFromPlatform {

  private _options: UserOptions;

  private _librariesIoApiHandler: LibrariesAPIHandler = null;

  constructor() {
    this.initLibrariesApiHandler();
  }

  public async run() {
    if (!this._librariesIoApiHandler) {
      this.initLibrariesApiHandler();
    }

    try {
      this._options = await getUserOptions(process.argv);
    } catch (err) {
      console.error('Error in getting user options', err);
      console.error('\nExiting...');

      return;
    }


    console.log('Starting...');
    const platform: BasePlatform = platformFactory(this._options.platform);

    this._librariesIoApiHandler.getPackagesInPlatform(this._options)
      .then((packages) => platform.createDownloadScript(packages, this._options.charsAmountInSingleScript))
      .then(this._handleDownloadScript)
      .then(this._onFinish)
      .catch(console.error);

  }

  private initLibrariesApiHandler(): void {
    const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY;
    if (LIBRARIES_IO_API_KEY) {
      this._librariesIoApiHandler = new LibrariesAPIHandler({
        apiKey: LIBRARIES_IO_API_KEY
      });
    }
  }

  private _onFinish = (): void => {
    console.log('Finished!');
  }

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

