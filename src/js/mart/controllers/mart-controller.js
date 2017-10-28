import events from '../../utils/events';
import getNumber from '../../utils/get-number';
import deepClone from '../../utils/deep-clone';
import ItemModelList from '../models/item-model-list';
import {
    EL_ADDED,
    ITEM_LIST_CLICKED,
    MART_CTRL_GET_TOTAL_COST,
    MART_CTRL_SET_TOTAL_COST,
} from '../const/events';

/**
 * This class will handle the business logic and will act as an event bus for the page
 *
 * It will update the right view when left view will add new data and calculate total cost of all selected items
 */
export default class MartCtrl {

    /**
     * Calculate total cost
     * @param item
     * @returns {*}
     */
    static getItemCost(item) {
        return item.cost - item.discount + item.shipping + item.tax;
    }

    constructor() {
        // init models
        const newModel = {
            name: 'Item 1',
            image: 'http://lorempixel.com/160/110/',
            discount: '0.10',
            tax: '1.10',
            cost: '8.99',
            shipping: '0.50',
        };
        const newModel2 = {
            name: 'Item 2',
            image: 'http://lorempixel.com/160/110/',
            discount: '1.10',
            tax: '2.10',
            cost: '8.99',
            shipping: '0.50',
        };
        const newModel3 = {
            name: 'Item 1',
            image: 'http://lorempixel.com/160/110/',
            discount: '0.10',
            tax: '1.10',
            cost: '8.99',
            shipping: '0.50',
        };

        this.itemModelList = new ItemModelList([]);
        this.initListeners();
        this.addItemToList(newModel);
        this.addItemToList(newModel2);
        this.addItemToList(newModel3);
    }

    initListeners() {
        events.on(EL_ADDED, this.addItemToList.bind(this));
        events.on(ITEM_LIST_CLICKED, this.updateSelectedItems.bind(this));
        events.on(MART_CTRL_GET_TOTAL_COST, this.getTotalSelectedItemsCost.bind(this));
    }

    /**
     * Adds new item to the model
     * @param item
     */
    addItemToList(item) {
        const newItem = deepClone(item);

        this.itemModelList.add(newItem);
    }

    /**
     * Updates isChecked status on the model for clicked item
     * @param args
     */
    updateSelectedItems(args) {
        const index = getNumber(args.index);

        this.itemModelList.updateItem(index, args.values, args.replace);
    }

    /**
     * Loops through model data and calculates the total cost of all selected items
     * Emits event when new total cost is set
     */
    getTotalSelectedItemsCost() {
        const totalCost = this.itemModelList.data.reduce((prevVal, item) => {
            if (!item.isChecked) {
                return prevVal;
            }

            return prevVal + MartCtrl.getItemCost(item);

        }, 0);

        events.emit(MART_CTRL_SET_TOTAL_COST, totalCost);
    }

}
