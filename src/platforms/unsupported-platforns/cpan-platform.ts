import {DefaultPlatform} from '../default-platform';
import {PlatformOptions} from '../platform-options';

export class CpanPlatform extends DefaultPlatform {
  static readonly instance: CpanPlatform = new CpanPlatform();

  readonly name: PlatformOptions = PlatformOptions.CPAN;

  private constructor() {
    super();
  }
}
