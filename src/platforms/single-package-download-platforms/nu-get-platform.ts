import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class NuGetPlatform extends BasePlatform {
  static readonly instance: NuGetPlatform = new NuGetPlatform();

  readonly name: PlatformOptions = PlatformOptions.NUGET;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = false;

  /**
   * the length of `Install-Package `
   */
  totalScriptAdditionLen: number = 16;

  separatorLen: number = 0;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(packageName: string): string {
    return `Install-Package ${packageName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return packages.map(this.createScriptForSinglePackageName).join('\n');
  }

}
