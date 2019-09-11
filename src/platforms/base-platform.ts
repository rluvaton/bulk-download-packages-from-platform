import {PlatformOptions} from './platform-options';
import {Package} from '../common/package';
import {splitIntoChunksBasedOnCharsCount, SplitIntoChunksResult} from '../helpers/utils';

export abstract class BasePlatform {
  readonly abstract name: PlatformOptions;

  /**
   * Is the platform support package downloading scripts?
   */
  readonly abstract isSupported: boolean;

  /**
   * Is this platform support multiple packages download at one script?
   */
  readonly abstract supportMultiplePackagesDownloading: boolean;

  /**
   * How much the download script (without any packages) take?
   *
   * @example NPM
   * For NPM it's the length of `npm install `
   */
  protected abstract totalScriptAdditionLen: number;

  /**
   * Separator length (for multi packages download only)
   *
   * @example NPM
   * For NPM it's 1 (what separate between each package is space)
   */
  protected abstract separatorLen: number;

  /**
   * Create Download script for packages
   * @param packages packages to download
   * @param charsAmountInSingleScript how much characters in single script
   * @return The script(s)
   */
  createDownloadScript(packages: Package[], charsAmountInSingleScript: number): string {
    if (!this.isSupported) {
      return this._getDownloadScriptForUnsupportedPlatforms(packages);
    }

    if (!this.supportMultiplePackagesDownloading) {
      // TODO - handle the case that some packages length are greater than the `charsAmountInSingleScript` value
      return this._getScriptForSinglePackageDownload(packages);
    }

    return BasePlatform._divideScriptToChunk(packages, charsAmountInSingleScript, this);
  }

  /**
   * Get package string for downloading
   * @param p Package
   * @return Package string for downloading
   *
   * @example NPM - get name & version
   * return `${p.name}@${p.latestStableReleaseNumber}`;
   */
  protected getPackageStr(p: Package): string {
    return p.name;
  }

  /**
   * Create script for packages no matter the size
   * @param packages
   * @return Download script
   */
  protected abstract createScriptFromPackages(packages: string[]): string;

  private _getDownloadScriptForUnsupportedPlatforms(packages: Package[]) {
    return `${this.name ? `Platform ${this.name} ` : ''}Not Supported\n${packages.map(this.getPackageStr).join(' ')}`;
  }

  private _getScriptForSinglePackageDownload(packages: Package[]): string {
    return packages.map(this.createScriptForSinglePackage).join('\n');
  }

  protected createScriptForSinglePackage(p: Package): string {
    return this.createScriptForSinglePackageName(this.getPackageStr(p));
  }

  protected abstract createScriptForSinglePackageName(packageName: string): string;

  /**
   * Divide script to chunks
   * @param packages packages
   * @param chunkSize chunk size
   * @param platform Platform to create
   * @return The script
   *
   *
   * @example For NPM
   *
   * // `getPackageStr` function for npm with versions
   * function getPackageStr(singlePackage) {
   *     return `${singlePackage.name}@${singlePackage.latestStableReleaseNumber}`
   * }
   * // `totalScriptAdditionLen` will be
   * totalScriptAdditionLen = 'npm install '.length
   *
   * // The `separatorLen` will be the separator length for NPM
   * // (For other platforms that need that for each package it will need to be like this `"${platform}" ` the length is 3 (quotes + space))
   * separatorLen = ' '.length
   *
   * function createScriptFromPackages(packages) {
   *     return `npm install ${singleChunk.join(' ')}`
   * }
   *
   */
  private static _divideScriptToChunk(packages: Package[], chunkSize: number, platform: BasePlatform): string {

    const readyPackages: string[] = packages.map(platform.getPackageStr);

    chunkSize -= platform.totalScriptAdditionLen;

    const chunksResult: SplitIntoChunksResult<string> = splitIntoChunksBasedOnCharsCount(readyPackages, chunkSize, (item) => item, platform.separatorLen);

    let script: string = '';

    if (chunksResult.leftOut.length > 0) {
      script += `This packages has left out because the chunk size is too small for them: ${chunksResult.leftOut.join(' ')}\n---------------------\n`;
    }

    script += chunksResult.chunks.map(platform.createScriptFromPackages).join('\n');
    return script;
  }
}
