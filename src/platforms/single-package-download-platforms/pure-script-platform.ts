import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class PureScriptPlatform extends BasePlatform {
  static readonly instance: PureScriptPlatform = new PureScriptPlatform();

  readonly name: PlatformOptions = PlatformOptions.PURE_SCRIPT;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = false;

  /**
   * the length of `psc-package install `
   */
  totalScriptAdditionLen: number = 20;

  separatorLen: number = 0;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(packageName: string): string {
    return `psc-package install ${packageName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return packages.map(this.createScriptForSinglePackageName).join('\n');
  }

}
