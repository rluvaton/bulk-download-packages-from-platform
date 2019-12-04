import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class HackagePlatform extends BasePlatform {
  static readonly instance: HackagePlatform = new HackagePlatform();

  readonly name: PlatformOptions = PlatformOptions.HACKAGE;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `cabal install `
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
    return `cabal install ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `cabal install ${packages.join(' ')}`;
  }

}
