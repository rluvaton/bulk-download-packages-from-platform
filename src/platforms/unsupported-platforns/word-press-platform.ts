import {DefaultPlatform} from '../default-platform';
import {PlatformOptions} from '../platform-options';

export class WordPressPlatform extends DefaultPlatform {
  static readonly instance: WordPressPlatform = new WordPressPlatform();

  readonly name: PlatformOptions = PlatformOptions.WORD_PRESS;

  private constructor() {
    super();
  }
}
