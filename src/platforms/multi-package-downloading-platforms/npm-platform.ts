import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';
import {Package} from '../../common/package';
import {requestWithPromise} from '../../helpers/utils';

export class NpmPlatform extends BasePlatform {

  private static totalScriptAdditionLen: number = 'npm install '.length;

  readonly isSupported: boolean = true;
  readonly name: PlatformOptions = PlatformOptions.NPM;
  readonly supportMultiplePackagesDownloading: boolean = true;
  readonly needToCheckPackagesExistence: boolean = true;

  totalScriptAdditionLen: number = NpmPlatform.totalScriptAdditionLen;

  /**
   * The length of ' ' (space)
   */
  separatorLen: number = 1;

  private static _optionsLength = {
    GLOBAL: ' -g'.length
  };

  /**
   * @inheritDoc
   */
  protected _isGlobalSupported: boolean = true;

  // Must be at the end of variables initialization
  static readonly instance: NpmPlatform = new NpmPlatform();

  private constructor() {
    super();
  }

  createScriptFromPackages(readyPackages: string[], addGlobal: boolean = false): string {
    return `npm install ${readyPackages.join(' ')}${addGlobal ? ' -g' : ''}`;
  }

  protected createScriptForSinglePackageName(pName: string, addGlobal: boolean = false): string {
    return `npm install ${pName}${addGlobal ? ' -g' : ''}`;
  }

  getPackageStr(p: Package): string {
    return `${p.name}` + (p.latestStableReleaseNumber ? `@${p.latestStableReleaseNumber}` : '');
  }

  protected getTotalScriptAdditionLen(addGlobal: boolean = false): number {
    return this.totalScriptAdditionLen + ((addGlobal) ? NpmPlatform._optionsLength.GLOBAL : 0);
  }


  public async isPackageExist(p: Package): Promise<boolean> {
    // (i.e https://registry.npmjs.org/react/15.0.0)
    const checkPackageUrl = `https://registry.npmjs.org/${p.name}/${p.latestStableReleaseNumber}`;
    let res;
    try {
      res = await requestWithPromise({
        method: 'GET',
        url: checkPackageUrl,
        qs: {},
        headers: {
          'cache-control': 'no-cache',
          Connection: 'keep-alive',
          'accept-encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache',
          Accept: '*/*',
        }
      });

      res = !res.includes('version not found');
    } catch (e) {
      console.log('error in res', e);
      res = false;
    }

    return res;
  }
}
