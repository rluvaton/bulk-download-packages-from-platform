import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class SublimePlatform extends BasePlatform {
  static readonly instance: SublimePlatform = new SublimePlatform();

  readonly name: PlatformOptions = PlatformOptions.SUBLIME;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * No script addition
   */
  totalScriptAdditionLen: number = 0;

  /**
   * The length of `,` (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return pName;
  }

  createScriptFromPackages(packages: string[]): string {
    return packages.join(',');
  }

}
