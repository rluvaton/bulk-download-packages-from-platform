import {DefaultPlatform} from '../default-platform';
import {PlatformOptions} from '../platform-options';

export class CarthagePlatform extends DefaultPlatform {
  static readonly instance: CarthagePlatform = new CarthagePlatform();

  readonly name: PlatformOptions = PlatformOptions.CARTHAGE;

  private constructor() {
    super();
  }
}
