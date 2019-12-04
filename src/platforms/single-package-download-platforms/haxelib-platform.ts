import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class HaxelibPlatform extends BasePlatform {
  static readonly instance: HaxelibPlatform = new HaxelibPlatform();

  readonly name: PlatformOptions = PlatformOptions.HAXELIB;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = false;

  /**
   * the length of `haxelib install `
   */
  totalScriptAdditionLen: number = 16;

  separatorLen: number = 0;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(packageName: string): string {
    return `haxelib install ${packageName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return packages.map(this.createScriptForSinglePackageName).join('\n');
  }

}
