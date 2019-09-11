import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class InqludePlatform extends BasePlatform {
  static readonly instance: InqludePlatform = new InqludePlatform();

  readonly name: PlatformOptions = PlatformOptions.INQLUDE;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = false;

  /**
   * the length of `inqlude install `
   */
  totalScriptAdditionLen: number = 16;

  separatorLen: number = 0;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(packageName: string): string {
    return `inqlude install ${packageName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return packages.map(this.createScriptForSinglePackageName).join('\n');
  }

}
