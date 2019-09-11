import {DefaultPlatform} from '../default-platform';
import {PlatformOptions} from '../platform-options';

export class MavenPlatform extends DefaultPlatform {
  static readonly instance: MavenPlatform = new MavenPlatform();

  readonly name: PlatformOptions = PlatformOptions.MAVEN;

  private constructor() {
    super();
  }
}
