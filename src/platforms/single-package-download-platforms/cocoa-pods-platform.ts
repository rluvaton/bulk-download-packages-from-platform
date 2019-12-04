import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class CocoaPodsPlatform extends BasePlatform {
  static readonly instance: CocoaPodsPlatform = new CocoaPodsPlatform();

  readonly name: PlatformOptions = PlatformOptions.COCOA_PODS;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = false;

  /**
   * the length of `pod try `
   */
  totalScriptAdditionLen: number = 8;

  separatorLen: number = 0;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(packageName: string): string {
    return `pod try ${packageName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return packages.map(this.createScriptForSinglePackageName).join('\n');
  }


}
