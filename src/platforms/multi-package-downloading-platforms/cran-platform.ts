import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';
import {Package} from '../../common/package';

export class CranPlatform extends BasePlatform {
  static readonly instance: CranPlatform = new CranPlatform();

  readonly name: PlatformOptions = PlatformOptions.CRAN;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `install.packages(c(<packages>))`
   */
  totalScriptAdditionLen: number = 21;

  /**
   * The length of ` ` (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `install.packages(c(${pName}))`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `install.packages(c(${packages.join(' ')}))`;
  }

  getPackageStr(p: Package): string {
    return `"${p.name}"`;
  }
}
