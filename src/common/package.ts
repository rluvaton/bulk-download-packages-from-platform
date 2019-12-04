import {PlatformOptions} from '../platforms/platform-options';

export interface Package {
  /**
   * Package name (i.e react)
   */
  name: string;

  /**
   * Platform that the package was taken from (i.e NPM)
   */
  platform: PlatformOptions;

  /**
   * Latest stable release number (i.e 1.5.1)
   */
  latestStableReleaseNumber: string;

  /**
   * The timestamp in UTC & milliseconds format that the version was published
   */
  latestStableReleasePublishTimestamp: number;
}
