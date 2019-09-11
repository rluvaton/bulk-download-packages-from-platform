import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class CargoPlatform extends BasePlatform {
  static readonly instance: CargoPlatform = new CargoPlatform();

  readonly name: PlatformOptions = PlatformOptions.CARGO;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `cargo install `
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
    return `cargo install ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `cargo install ${packages.join(' ')}`;
  }

}
