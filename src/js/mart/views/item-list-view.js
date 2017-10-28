import events from '../../utils/events';
import delegate from '../../utils/delegate';
import itemView from './item-view';
import {
    ITEM_LIST_ADDED_MODEL,
    ITEM_LIST_CLICKED,
    MART_CTRL_SET_TOTAL_COST,
    MART_CTRL_GET_TOTAL_COST,
} from '../const/events';

/**
 * The user interaction logic for the right component
 * Will render new item every time a new item is added into the model
 * Will render total cost once the total cost is calculated by the controller
 */
export default class ItemListView {

    static addToCartListener (el) {
        function filterCheckbox(target) {
            return target && target.matches('.checkbox');
        }

        /**
         * Will trigger an update event when user clicks the select item checkbox
         * It is delegated for performance reasons since we might have multiple clicks on the page
         */
        el.addEventListener('click', delegate(filterCheckbox, e => {
            events.emit(ITEM_LIST_CLICKED, {
                index: e.target.dataset.index,
                values: {
                    isChecked: e.target.checked,
                },
                replace: false,
            });
        }));

        // Will trigger the calculate total cost event
        el.querySelector('.added-item-list-primary-action')
            .addEventListener('click', e => {
                events.emit(MART_CTRL_GET_TOTAL_COST);
            });
    }

    /**
     * Pass object as argument to make easily extandable this class in the future
     * @param args
     */
    constructor(args) {
        this.el = document.getElementById(args.elId);
        this.itemList = document.getElementById(args.listId);
        ItemListView.addToCartListener(this.el);

        events.on(ITEM_LIST_ADDED_MODEL, this.renderItem.bind(this));
        events.on(MART_CTRL_SET_TOTAL_COST, this.renderCost.bind(this));
    }

    /**
     * Renders new item in list
     * @param data
     */
    renderItem(data) {
        const newItem = itemView.getTemplate(data[data.length - 1]);

        this.itemList.insertAdjacentHTML('beforeend', newItem);
    }

    /**
     * Renders total cost
     * @param cost
     */
    renderCost(cost) {
        this.el.querySelector('.add-items-list-price').innerHTML = `
            <div class="text-right">Total cost: <span class="ft-right">${cost}</span></div>
        `;
    }
}
