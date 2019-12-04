import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class ElmPlatform extends BasePlatform {
  static readonly instance: ElmPlatform = new ElmPlatform();

  readonly name: PlatformOptions = PlatformOptions.ELM;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = false;

  /**
   * the length of `elm install `
   */
  totalScriptAdditionLen: number = 12;

  separatorLen: number = 0;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(packageName: string): string {
    return `elm install ${packageName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return packages.map(this.createScriptForSinglePackageName).join('\n');
  }

}
