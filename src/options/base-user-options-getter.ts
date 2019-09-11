import {UserOptions} from './user-options';
import {UserOptionsValidator} from './user-options-validator';

export abstract class BaseUserOptionsGetter {

  /**
   * Get User Options
   */
  protected abstract _getOptions(): Promise<UserOptions>;

  public async getOptions(): Promise<UserOptions> {
    const options: UserOptions = await this._getOptions();

    await UserOptionsValidator.instance.validateOptions(options);

    return options;
  }
}
