import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';
import {Package} from '../../common/package';

export class PlatformIOPlatform extends BasePlatform {
  static readonly instance: PlatformIOPlatform = new PlatformIOPlatform();

  readonly name: PlatformOptions = PlatformOptions.PLATFORM_IO;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = false;

  /**
   * the length of `pio lib install `
   */
  totalScriptAdditionLen: number = 16;

  separatorLen: number = 0;

  private constructor() {
    super();
  }

  getPackageStr(p: Package): string {
    return `"${p.name}"`;
  }

  protected createScriptForSinglePackageName(packageName: string): string {
    return `pio lib install ${packageName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return packages.map(this.createScriptForSinglePackageName).join('\n');
  }


}
