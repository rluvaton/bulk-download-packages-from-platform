const utils = require('../utils');

const OptionsFromProgramArgs = require('./options-from-program-args');
const OptionsFromUserInput = require('./options-from-user-input');

const UserOptionsHandler = {

    /**
     * Get user options
     * @return {Promise<UserOptions>}
     */
    getUserOptions: async function (programArgs) {
        let options;

        if(OptionsFromProgramArgs.isArgsContainOptions(programArgs)) {
            options = await OptionsFromProgramArgs.getUserOptionsFromProgramArgs(programArgs).catch((err) => {
                console.error('Error in getting user options from program args', err);
                console.log('Fallback to manual setting the options...');
                return null;
            });
        }

        if(!options) {
            options = await OptionsFromUserInput.getOptionsFromInput().catch((err) => {
                console.error('Error in getting user options from input', err);
                throw err;
            });
        }

        return options;
    },
};

module.exports = UserOptionsHandler;
