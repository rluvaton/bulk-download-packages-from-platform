import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class AtomPlatform extends BasePlatform {
  static readonly instance: AtomPlatform = new AtomPlatform();

  readonly name: PlatformOptions = PlatformOptions.ATOM;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `apm install `
   */
  totalScriptAdditionLen: number = 12;

  /**
   * The length of ` ` (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `apm install ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `apm install ${packages.join(' ')}`;
  }

}
