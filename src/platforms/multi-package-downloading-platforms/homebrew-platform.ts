import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class HomebrewPlatform extends BasePlatform {
  static readonly instance: HomebrewPlatform = new HomebrewPlatform();

  readonly name: PlatformOptions = PlatformOptions.HOMEBREW;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `brew install `
   */
  totalScriptAdditionLen: number = 13;

  /**
   * The length of ` ` (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `brew install ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `brew install ${packages.join(' ')}`;
  }

}
