import getNumber from './get-number';

/**
 * Validates input fields based on their present classes
 * This is ment to be used for input type text and numbers mainly
 */
export default (value, classList) => {
    const iterableRules = getRules(classList);
    const inputValue = (typeof value === 'undefined' || value === 'undefined') ? '' : value.trim();

    for (const rule of iterableRules) {
        if (!rule(inputValue)) {
            return false;
        }
    }

    return true;
}

/**
 * Generates validation rules based on their css class
 * TODO break this into smaller methods
 * @param classList
 * @returns {Array} All the rules that will be applied on the input value in order to check the value is valid
 */
function getRules (classList) {
    const rules = [];

    if(classList.contains('is-required')) {
         const isRequired = (val) => {

             return !(val.length < 1);
        };

        rules.push(isRequired);
    }

    if (classList.contains('is-positive-number')) {
        const isPositiveNumber = (val) => {
            const numberVal = getNumber(val);

            return !(numberVal < 0);
        };
        rules.push(isPositiveNumber);
    }

    // this rule is ment for fields that are numbers and should be greater then 0
    if (classList.contains('has-value')) {
        const numberIsGreaterThanZero = (val) => {
            const numberVal = getNumber(val);

            return numberVal > 0;
        };
        rules.push(numberIsGreaterThanZero);
    }

    if (classList.contains('is-url')) {
        const isValidUrl = (val) => {
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(val);
        };
        rules.push(isValidUrl);
    }

    return rules;
}
