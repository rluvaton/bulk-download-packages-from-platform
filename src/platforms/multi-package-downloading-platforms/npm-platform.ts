import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';
import {Package} from '../../common/package';

export class NpmPlatform extends BasePlatform {
  static readonly instance: NpmPlatform = new NpmPlatform();

  readonly isSupported: boolean = true;
  readonly name: PlatformOptions = PlatformOptions.NPM;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `npm install `
   */
  totalScriptAdditionLen: number = 12;

  /**
   * The length of ' ' (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  createScriptFromPackages(readyPackages: string[]): string {
    return `npm install ${readyPackages.join(' ')}`;
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `npm install ${pName}`;
  }

  getPackageStr(p: Package): string {
    return `${p.name}` + (p.latestStableReleaseNumber ? `@${p.latestStableReleaseNumber}` : '');
  }
}
