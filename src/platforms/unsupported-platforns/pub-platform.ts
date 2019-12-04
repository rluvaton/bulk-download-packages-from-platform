import {DefaultPlatform} from '../default-platform';
import {PlatformOptions} from '../platform-options';

export class PubPlatform extends DefaultPlatform {
  static readonly instance: PubPlatform = new PubPlatform();

  readonly name: PlatformOptions = PlatformOptions.PUB;

  private constructor() {
    super();
  }
}
