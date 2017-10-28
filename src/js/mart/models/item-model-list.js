import events from '../../utils/events';
import deepClone from '../../utils/deep-clone';
import getNumber from '../../utils/get-number';
import {
    ITEM_LIST_ADDED_MODEL,
} from '../const/events';

/**
 * This class holds all data for the right side view and it's status
 */
export default class ItemModelList {

    constructor (data = []) {
        this.data = data;
    }

    /**
     * Adds new item at the end of the list
     * @param item
     */
    add(item) {
        const newItem = deepClone(item);

        newItem.id = window.performance.now();
        newItem.index = this.data.length || 0;

        this.data.push(this.normaliseItemValues(newItem));
        events.emit(ITEM_LIST_ADDED_MODEL, this.data);
    }

    /**
     * Updates specific item from index with passed data. If replace is true, the whole item will be re-written
     * if not the new data will be merged into the old data
     * @param index {number}
     * @param values {object}
     * @param replace {boolean}
     */
    updateItem(index, values, replace) {
        let itemToUpdate = deepClone(this.data[index]);

        if (replace) {
            itemToUpdate = values;
        }
        else {
            itemToUpdate = Object.assign({}, itemToUpdate, values);
        }

        this.data[index] = this.normaliseItemValues(itemToUpdate);
    }

    /**
     * Will loop through the received model and will set the correct data types, because js...
     * @param item
     * @returns {*}
     */
    normaliseItemValues(item) {
        const newItem = deepClone(item);

        newItem.tax = newItem.tax ? getNumber(newItem.tax) : '';
        newItem.discount = newItem.discount ? getNumber(newItem.discount) : '';
        newItem.cost = newItem.cost ? getNumber(newItem.cost) : '';
        newItem.shipping = newItem.shipping ? getNumber(newItem.shipping) : '';

        return newItem
    }
}
