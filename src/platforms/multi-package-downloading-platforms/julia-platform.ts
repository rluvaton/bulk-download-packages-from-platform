import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';
import {Package} from '../../common/package';

export class JuliaPlatform extends BasePlatform {
  static readonly instance: JuliaPlatform = new JuliaPlatform();

  readonly name: PlatformOptions = PlatformOptions.JULIA;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `Pkg.add([<packages>])`
   */
  totalScriptAdditionLen: number = 11;

  /**
   * The length of `, ` (comma + space)
   */
  separatorLen: number = 2;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `Pkg.add(${pName})`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `Pkg.add([${packages.join(', ')}])`;
  }

  getPackageStr(p: Package): string {
    return `"${p.name}"`;
  }
}
