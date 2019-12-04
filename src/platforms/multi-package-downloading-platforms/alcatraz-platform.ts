import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class AlcatrazPlatform extends BasePlatform {
  static readonly instance: AlcatrazPlatform = new AlcatrazPlatform();

  readonly name: PlatformOptions = PlatformOptions.ALCATRAZ;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `lerna add `
   */
  totalScriptAdditionLen: number = 10;

  /**
   * The length of ` ` (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(packageName: string): string {
    return `lerna add ${packageName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `lerna add ${packages.join(' ')}`;
  }

}
