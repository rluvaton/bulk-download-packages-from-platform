import {Bar} from 'cli-progress';
import {PackagesGetterProgressInfo} from './common/progress/packages-getter-progress-info';
import {isNil} from './helpers/validate-helper';

export class ProgressAdapter {

  protected bar: Bar;

  constructor() {

    // create new progress bar
    this.bar = new Bar({
      format: 'CLI Progress | {bar} | {percentage}% || {pageValue}/{pageTotal} || {pckValue}/{pckTotal} Packages || Speed: {speed}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
  }

  public start(progressInfo: PackagesGetterProgressInfo) {
    // initialize the bar - defining payload token "speed" with the default value "N/A"
    this.bar.start(progressInfo.packages.total, progressInfo.packages.downloaded, this._createPayloadFromProgressInfo(progressInfo));
  }

  public updateProgress(progressInfo: PackagesGetterProgressInfo) {
    // update values
    this.bar.update(progressInfo.packages.downloaded, this._createPayloadFromProgressInfo(progressInfo));
  }

  public finishProgress() {
    this.bar.stop();
  }

  private _createPayloadFromProgressInfo(progressInfo: PackagesGetterProgressInfo): any {
    return {
      pageValue: progressInfo.pages.currentNum,
      pageTotal: progressInfo.pages.total,

      pckValue: progressInfo.packages.downloaded,
      pckTotal: progressInfo.packages.total,

      speed: this.prettifySize(progressInfo.speedInBytesPerSec)
    };
  }

  /**
   * @TODO - Add type of size (byte / MB / etc...) to convert
   */
  private prettifySize(speed: number) {
    return (isNil(speed) || speed < 0) ? 'N/A' : `${speed}b/s`;
  }
}
