import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class MeteorPlatform extends BasePlatform {
  static readonly instance: MeteorPlatform = new MeteorPlatform();

  readonly name: PlatformOptions = PlatformOptions.METEOR;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `meteor add `
   */
  totalScriptAdditionLen: number = 11;

  /**
   * The length of ` ` (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `meteor add ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `meteor add ${packages.join(' ')}`;
  }

}
