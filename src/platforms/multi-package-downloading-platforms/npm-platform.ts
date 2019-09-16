import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';
import {Package} from '../../common/package';

export class NpmPlatform extends BasePlatform {
  static readonly instance: NpmPlatform = new NpmPlatform();

  private static totalScriptAdditionLen: number = 'npm install '.length;

  readonly isSupported: boolean = true;
  readonly name: PlatformOptions = PlatformOptions.NPM;
  readonly supportMultiplePackagesDownloading: boolean = true;

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
}
