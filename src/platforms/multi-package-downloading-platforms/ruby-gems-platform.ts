import {BasePlatform} from '../base-platform';
import {PlatformOptions} from '../platform-options';

export class RubyGemsPlatform extends BasePlatform {
  static readonly instance: RubyGemsPlatform = new RubyGemsPlatform();

  readonly name: PlatformOptions = PlatformOptions.RUBYGEMS;
  readonly isSupported: boolean = true;
  readonly supportMultiplePackagesDownloading: boolean = true;

  /**
   * The length of `gem install `
   */
  totalScriptAdditionLen: number = 12;

  /**
   * The length of ` ` (space)
   */
  separatorLen: number = 1;

  private constructor() {
    super();
  }

  protected createScriptForSinglePackageName(pName: string): string {
    return `gem install ${pName}`;
  }

  createScriptFromPackages(packages: string[]): string {
    return `gem install ${packages.join(' ')}`;
  }

}
