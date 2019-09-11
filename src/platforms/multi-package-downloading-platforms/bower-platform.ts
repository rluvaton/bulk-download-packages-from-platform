import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class BowerPlatform extends BasePlatform {
  static readonly instance: BowerPlatform = new BowerPlatform();

  readonly name: PlatformOptions = PlatformOptions.BOWER;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `bower install `
   */
  totalScriptAdditionLen: number = 14;

  /**
   * The length of ` ` (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `bower install ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `bower install ${packages.join(' ')}`;
  }

}
