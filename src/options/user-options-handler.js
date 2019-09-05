const optionsFromProgramArgs = require('./options-from-program-args');
const optionsFromUserInput = require('./options-from-user-input');

const userOptionsHandler = {

    /**
     * Get user options
     * @return {Promise<UserOptions>}
     */
    getUserOptions: async function (programArgs) {
        let options;

        if(optionsFromProgramArgs.isArgsContainOptions(programArgs)) {
            options = await optionsFromProgramArgs.getUserOptionsFromProgramArgs(programArgs).catch((err) => {
                console.error('Error in getting user options from program args', err);
                console.log('Fallback to manual setting the options...');
                return null;
            });
        }

        if(!options) {
            options = await optionsFromUserInput.getOptionsFromInput().catch((err) => {
                console.error('Error in getting user options from input', err);
                throw err;
            });
        }

        return options;
    },
};

module.exports = userOptionsHandler;
