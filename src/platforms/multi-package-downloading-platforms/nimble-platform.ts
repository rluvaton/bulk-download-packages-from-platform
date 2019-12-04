import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class NimblePlatform extends BasePlatform {
  static readonly instance: NimblePlatform = new NimblePlatform();

  readonly name: PlatformOptions = PlatformOptions.DUB;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `nimble install `
   */
  totalScriptAdditionLen: number = 15;

  /**
   * The length of ` ` (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `nimble install ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `nimble install ${packages.join(' ')}`;
  }

}
