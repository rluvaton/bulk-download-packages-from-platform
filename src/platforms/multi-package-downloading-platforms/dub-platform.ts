import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class DubPlatform extends BasePlatform {
  static readonly instance: DubPlatform = new DubPlatform();

  readonly name: PlatformOptions = PlatformOptions.DUB;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `dub fetch `
   */
  totalScriptAdditionLen: number = 10;

  /**
   * The length of ` ` (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `dub fetch ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `dub fetch ${packages.join(' ')}`;
  }

}
