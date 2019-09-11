import {DefaultPlatform} from '../default-platform';
import {PlatformOptions} from '../platform-options';

export class SwiftPMPlatform extends DefaultPlatform {
  static readonly instance: SwiftPMPlatform = new SwiftPMPlatform();

  readonly name: PlatformOptions = PlatformOptions.SWIFT_PM;

  private constructor() {
    super();
  }
}
