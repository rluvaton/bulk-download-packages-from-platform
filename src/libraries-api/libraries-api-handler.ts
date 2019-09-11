import {UserOptions} from '../options/user-options';
import {PlatformOptions} from '../platforms/platform-options';
import {SortOptions} from '../common/sort-options';
import {Package} from '../common/package';
import {defaultErrorHandling, getUTCTimestampFromDateStr, requestWithPromise, sleep} from '../helpers/utils';

export interface LibrariesAPIHandlerOptions {
  apiKey: string;
}

export class LibrariesAPIHandler {

  private _apiKey: string;


  constructor(options: LibrariesAPIHandlerOptions) {
    this._validateOptions(options);

    this._apiKey = options.apiKey;
  }

  private _validateOptions(options: LibrariesAPIHandlerOptions): void {
    if (!options) {
      throw {
        message: 'UserOptions can\'t be falsy'
      };
    }

    if (!options.apiKey) {
      throw {
        message: 'API key is required'
      };
    }
  }

  async getPackagesInPlatform(options: UserOptions) {
    let popularPackagesName = [];
    let tempPagePackages;

    const total = options.totalPackages || 0;
    let page = options.startingPage || 1;

    let packagesLeft = total;

    // Check if we can finish the packages request without requesting more requests than the rate limit (60 requests/minutes)
    // Then we won't need to sleep each request
    const needToSleep = total > 6000;

    while (packagesLeft > 0) {
      tempPagePackages = await this._getPackagesInSinglePage(page, options).catch(defaultErrorHandling);

      // I'm doing if and not just `tempPagePackages.slice(0, packagesLeft)`
      // because if we won't need to slice the array eventually than it's 99.6% slower doing it without the if
      tempPagePackages = (packagesLeft < tempPagePackages.length) ? tempPagePackages.slice(0, packagesLeft) : tempPagePackages;

      packagesLeft -= tempPagePackages.length;
      page++;

      popularPackagesName = popularPackagesName.concat(tempPagePackages);

      if (needToSleep && packagesLeft <= 0) {
        // Can request only 60 requests/minutes = request every second
        await sleep(1000).catch(defaultErrorHandling);
      }
    }

    return popularPackagesName;
  }

  /**
   * Get packages in specified page
   * @param page Page to fetch packages from
   * @param options
   * @return Packages of the wanted page
   * @private
   */
  private async _getPackagesInSinglePage(page: number = 1, options: UserOptions): Promise<Array<any>> {

    const requestOptions = this._getLibrariesRequestOptions(page, options.platform, options.sortBy, 100);

    const res = await requestWithPromise(requestOptions)
      .catch(defaultErrorHandling);

    return this._parsePackagesFromResponse(res);
  }


  /**
   * Get the request options (for request library)
   * @param page Page to fetch
   * @param platform Platform to fetch the packages from (i.e npm)
   * @param sortType On what criteria to sort by
   * @param perPage How much packages per page
   * @return Request option
   * @private
   */
  private _getLibrariesRequestOptions(page: number, platform?: PlatformOptions, sortType?: SortOptions, perPage?: number): any {
    platform = platform || PlatformOptions.NPM;
    sortType = sortType || SortOptions.DEPENDENTS_COUNT;
    perPage = perPage || 100;

    return {
      method: 'GET',
      url: 'https://libraries.io/api/search',
      qs: {
        api_key: this._apiKey,
        platforms: platform,
        sort: sortType,
        page: page,
        per_page: perPage
      },
      headers: {
        'cache-control': 'no-cache',
        Connection: 'keep-alive',
        'accept-encoding': 'gzip, deflate',
        cookie: '_libraries_session=ejk2QzhLZjdUNFFHcXdYdU5XTHUvRVlnNEFPaHJzTmlGZ29aQ01vUkJvSU4xR0VXMURxd29WaWVTMnQ0ZUVWNmI5bUtVaWJjV1NNYllmWU5JUW5TaXBKUDl1d2dzTGxFVURjYkZubnUzdGlsOFB3OU96cHRIS1pNNnp3dEd3YndzSXI4eVplYm9EdW1tVHk5MFZnbEd3PT0tLXNSeDdMN0pnblQ0M1N1NlNFUTUwM0E9PQ%3D%3D--b0aac01e1ce281f07a5dc1a977f7b7f82cef1dfe',
        Host: 'libraries.io',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
      }
    };
  }

  /**
   * Parse the packages in the response from the API
   * @param res The response from the API
   * @return Packages
   * @private
   */
  private _parsePackagesFromResponse(res: any): Package[] {
    if (!res) {
      return [];
    }

    try {
      res = JSON.parse(res);
    } catch (e) {
      console.error(res);
      console.error(e);
      throw e;
    }
    return res.map(this._parsePackage);
  }

  /**
   * Parse Package
   * @param p Package as returned from the API
   * @return Package data
   * @private
   */
  private _parsePackage(p: any): Package {
    if (!p) {
      return null;
    }

    return {
      name: p.name,
      platform: p.platform,
      latestStableReleaseNumber: p.latest_stable_release_number,
      latestStableReleasePublishTimestamp: getUTCTimestampFromDateStr(p.latest_stable_release_published_at)
    };
  }
}
