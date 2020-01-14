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
   * Is the platform support package downloading scripts?
   */
  readonly abstract needToCheckPackagesExistence: boolean;

  /**
   * Is this platform support multiple packages download at one script?
   */
  readonly abstract supportMultiplePackagesDownloading: boolean;

  /**
   * How much the download script (without any packages) take?
   * DON'T USE THIS - USE THIS FUNCTION `getTotalScriptAdditionLen`
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
   * Is the platform support global packages downloading
   *
   * If changed - DON'T FORGET TO CHANGE THE `totalScriptAdditionLen` value
   */
  protected _isGlobalSupported: boolean = false;

  public isPackageExist(p: Package): Promise<boolean> {
    return Promise.resolve(true);
  }

  /**
   * Create Download script for packages
   * @param packages packages to download
   * @param charsAmountInSingleScript how much characters in single script
   * @param addGlobal Should add global (would add only if the platform support it)
   * @return The script(s)
   */
  createDownloadScript(packages: Package[], charsAmountInSingleScript: number, addGlobal: boolean = false): string {
    if (!this.isSupported) {
      return this._getDownloadScriptForUnsupportedPlatforms(packages);
    }

    if (!this.supportMultiplePackagesDownloading) {
      // TODO - handle the case that some packages length are greater than the `charsAmountInSingleScript` value
      return this._getScriptForSinglePackageDownload(packages, addGlobal && this._isGlobalSupported);
    }

    return BasePlatform._divideScriptToChunk(packages, charsAmountInSingleScript, addGlobal, this);
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
   * @param addGlobal Should add global (only if supported)
   * @return Download script
   */
  protected abstract createScriptFromPackages(packages: string[], addGlobal?: boolean): string;

  private _getDownloadScriptForUnsupportedPlatforms(packages: Package[]) {
    return `${this.name ? `Platform ${this.name} ` : ''}Not Supported\n${packages.map(this.getPackageStr).join(' ')}`;
  }

  private _getScriptForSinglePackageDownload(packages: Package[], addGlobal: boolean = false): string {
    return packages.map((p) => this.createScriptForSinglePackage(p, addGlobal)).join('\n');
  }

  protected createScriptForSinglePackage(p: Package, addGlobal: boolean = false): string {
    return this.createScriptForSinglePackageName(this.getPackageStr(p), addGlobal);
  }

  protected abstract createScriptForSinglePackageName(packageName: string, addGlobal?: boolean): string;

  /**
   * Divide script to chunks
   * @param packages packages
   * @param chunkSize chunk size
   * @param addGlobal Should add global (only for supported platforms)
   * @param platform Platform to create
   * @return The script
   */
  private static _divideScriptToChunk(packages: Package[], chunkSize: number, addGlobal: boolean = false, platform: BasePlatform): string {
    addGlobal = addGlobal && platform._isGlobalSupported;

    const readyPackages: string[] = packages.map(platform.getPackageStr);

    chunkSize -= platform.getTotalScriptAdditionLen(addGlobal);

    const chunksResult: SplitIntoChunksResult<string> = splitIntoChunksBasedOnCharsCount(readyPackages, chunkSize, (item) => item, platform.separatorLen);

    let script: string = '';

    if (chunksResult.leftOut.length > 0) {
      script += `This packages has left out because the chunk size is too small for them: ${chunksResult.leftOut.join(' ')}\n---------------------\n`;
    }

    script += chunksResult.chunks.map((chunk) => platform.createScriptFromPackages(chunk, addGlobal)).join('\n');
    return script;
  }

  get isGlobalSupported(): boolean {
    return this._isGlobalSupported;
  }

  protected getTotalScriptAdditionLen(addGlobal: boolean = false): number {
    return this.totalScriptAdditionLen;
  }
}
