import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class GoPlatform extends BasePlatform {
  static readonly instance: GoPlatform = new GoPlatform();

  readonly name: PlatformOptions = PlatformOptions.GO;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `go get `
   */
  totalScriptAdditionLen: number = 7;

  /**
   * The length of ` ` (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `go get ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `go get ${packages.join(' ')}`;
  }

}
