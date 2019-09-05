
const validationHelper = {

    /**
     * Check if value is either `null` or `undefined`
     * @param value Value to check
     * @return {boolean} The result if the value is nil
     */
    isNil: function (value) {
        // from SO answer - https://stackoverflow.com/a/5515385/5923666
        return value == null;
    },

    /**
     * return if variable is number or not
     * @param num any variable to check
     * @return {boolean} true if the variable is a number
     */
    isNumber: function (num) {
        return typeof num === 'number';
    }
};

module.exports = validationHelper;
