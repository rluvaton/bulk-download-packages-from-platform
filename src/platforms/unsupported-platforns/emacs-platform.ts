import {DefaultPlatform} from '../default-platform';
import {PlatformOptions} from '../platform-options';

export class EmacsPlatform extends DefaultPlatform {
  static readonly instance: EmacsPlatform = new EmacsPlatform();

  readonly name: PlatformOptions = PlatformOptions.EMACS;

  private constructor() {
    super();
  }
}
