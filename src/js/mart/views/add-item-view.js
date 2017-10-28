import events from '../../utils/events';
import getNumber from '../../utils/get-number';
import validateInput from '../../utils/validate-input';
import {
    EL_ADDED,
} from '../const/events';

const ERROR_CLASS_NAME = 'has-error';

/**
 * This class will handle the user interaction with the left view, will validate the data and will emit events when
 * form is submitted
 */
export default class AddItemView {

    static initDOMListeners (childForm) {
        const formInputs = childForm.querySelectorAll('.form-input');

        // add blur validation for each input
        formInputs.forEach((el) => {
            el.addEventListener('blur', AddItemView.validateInput);
        });

        childForm.addEventListener('submit', e => {
            e.preventDefault();
            let formIsValid = true;
            let formData = {};

            const inputFields = e.target.querySelectorAll('.form-input');
            // trigger validation for each field by calling focus/blur on each one
            inputFields.forEach(el => {
                el.focus();
                el.blur();

                if (el.parentNode.classList.contains(ERROR_CLASS_NAME)) {
                    formIsValid = false;
                }
                else {
                    formData[el.name] = el.classList.contains('is-positive-number') ? getNumber(el.value) : el.value;
                }
            });

            // if all inputs are valid, submit data
            if (formIsValid) {
                events.emit(EL_ADDED, formData);
                inputFields.forEach(el => el.value = '');
            }
        });
    }

    /**
     * Validate each input based on a set of rules given by it's specific css classes
     * @param e
     * @returns {*}
     */
    static validateInput (e) {
        const isInputValid = validateInput(e.target.value, e.target.classList);
        const ERROR_CLASS_NAME = 'has-error';

        /**
         * this will only work if the form-group div is direct parent of the element,
         * for more complex structures the function needs to be extended
         */
        if (isInputValid) {
            e.target.parentNode.classList.remove('has-error');
        }
        else if(!isInputValid && !e.target.parentNode.classList.contains(ERROR_CLASS_NAME)) {
            e.target.parentNode.classList += ` ${ERROR_CLASS_NAME}`;
        }

        return isInputValid;
    }

    /**
     * Use args obfuscate all arguments so this constructor is easier to extend at a later date
     * @param args
     */
    constructor (args) {
        const childForm = document.getElementById(args.formId);

        AddItemView.initDOMListeners(childForm);
    }

}
