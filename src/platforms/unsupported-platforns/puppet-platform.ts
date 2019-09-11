import {DefaultPlatform} from '../default-platform';
import {PlatformOptions} from '../platform-options';

export class PuppetPlatform extends DefaultPlatform {
  static readonly instance: PuppetPlatform = new PuppetPlatform();

  readonly name: PlatformOptions = PlatformOptions.PUPPET;

  private constructor() {
    super();
  }
}
