import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class PyPiPlatform extends BasePlatform {
  static readonly instance: PyPiPlatform = new PyPiPlatform();

  readonly name: PlatformOptions = PlatformOptions.PYPI;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `pip install`
   */
  totalScriptAdditionLen: number = 12;

  /**
   * The length of ' ' (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `pip install ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `pip install ${packages.join(' ')}`;
  }

}
