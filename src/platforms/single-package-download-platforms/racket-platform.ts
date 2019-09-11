import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class RacketPlatform extends BasePlatform {
  static readonly instance: RacketPlatform = new RacketPlatform();

  readonly name: PlatformOptions = PlatformOptions.RACKET;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = false;

  /**
   * the length of `raco pkg install `
   */
  totalScriptAdditionLen: number = 17;

  separatorLen: number = 0;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(packageName: string): string {
    return `raco pkg install ${packageName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return packages.map(this.createScriptForSinglePackageName).join('\n');
  }

}
