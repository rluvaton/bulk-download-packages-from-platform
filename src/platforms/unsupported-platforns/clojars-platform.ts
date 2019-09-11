import {DefaultPlatform} from '../default-platform';
import {PlatformOptions} from '../platform-options';

export class ClojarsPlatform extends DefaultPlatform {
  static readonly instance: ClojarsPlatform = new ClojarsPlatform();

  readonly name: PlatformOptions = PlatformOptions.CLOJARS;

  private constructor() {
    super();
  }
}
