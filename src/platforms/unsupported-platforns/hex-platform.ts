import {DefaultPlatform} from '../default-platform';
import {PlatformOptions} from '../platform-options';

export class HexPlatform extends DefaultPlatform {
  static readonly instance: HexPlatform = new HexPlatform();

  readonly name: PlatformOptions = PlatformOptions.HEX;

  private constructor() {
    super();
  }
}
