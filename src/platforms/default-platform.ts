import {BasePlatform} from './base-platform';
import {PlatformOptions} from './platform-options';
import {Package} from '../common/package';

export class DefaultPlatform extends BasePlatform {
  static readonly instance: DefaultPlatform = new DefaultPlatform();

  readonly isSupported: boolean = false;
  readonly name: PlatformOptions = null;
  readonly supportMultiplePackagesDownloading: boolean = false;

  separatorLen: number;
  totalScriptAdditionLen: number;

  protected constructor() {
    super();
  }

  protected createScriptForSinglePackage(p: Package): string {
    throw {
      name: 'Not supported'
    };
  }

  protected createScriptForSinglePackageName(packageName: string): string {
    return `Not Supported\n${packageName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `Not Supported\n${packages.join(' ')}`;
  }

}
