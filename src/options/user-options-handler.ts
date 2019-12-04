import {UserOptions} from './user-options';
import {UserOptionsProgramArgsGetter} from './user-options-program-args-getter';
import {BaseUserOptionsGetter} from './base-user-options-getter';
import {UserOptionsInputGetter} from './user-options-input-getter';

export async function getUserOptions(programArgs): Promise<UserOptions> {
  let options;

  let userOptionsGetter: BaseUserOptionsGetter = new UserOptionsProgramArgsGetter(programArgs);

  if ((userOptionsGetter as UserOptionsProgramArgsGetter).isRequestingHelp()) {
    (userOptionsGetter as UserOptionsProgramArgsGetter).showHelp();
    throw {
      name: 'help-request',
      message: 'Requested help',
    };
  }

  if ((userOptionsGetter as UserOptionsProgramArgsGetter).isArgsContainOptions()) {
    try {
      options = await userOptionsGetter.getOptions();
      return options;
    } catch (err) {
      console.error('Error in getting user options from program args', err);
      console.log('Fallback to manual setting the options...');

    }
  }

  userOptionsGetter = new UserOptionsInputGetter();
  options = await userOptionsGetter.getOptions().catch((err) => {
    console.error('Error in getting user options from input', err);
    throw err;
  });

  return options;
}



