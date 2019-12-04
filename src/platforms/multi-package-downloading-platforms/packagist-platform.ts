import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class PackagistPlatform extends BasePlatform {
  static readonly instance: PackagistPlatform = new PackagistPlatform();

  readonly isSupported: boolean = true;
  readonly name: PlatformOptions = PlatformOptions.PACKAGIST;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `composer require `
   */
  totalScriptAdditionLen: number = 17;

  /**
   * The length of ' ' (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `composer require ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `composer require ${packages.join(' ')}`;
  }

}
