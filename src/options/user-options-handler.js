const utils = require('../utils');

const OptionsFromProgramArgs = require('./options-from-program-args');
const OptionsFromUserInput = require('./options-from-user-input');

const UserOptionsHandler = {

    /**
     * Get user options
     * @return {Promise<UserOptions>}
     */
    getUserOptions: async function (programArgs) {
        let options = (OptionsFromProgramArgs.isArgsContainOptions(programArgs))
            ? OptionsFromProgramArgs.getUserOptionsFromProgramArgs(programArgs)
            : OptionsFromUserInput.getOptionsFromInput().catch(utils.defaultErrorHandling);

        return Promise.resolve(options);
    },
};

module.exports = UserOptionsHandler;
