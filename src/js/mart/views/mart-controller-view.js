import '../models/item-model-list';
import AddItemView from './add-item-view';
import ItemListView from './item-list-view';

/**
 * Initialises all sub views for the page
 */
export default class MartViewCtrl {

    constructor () {
        // start subviews
        new AddItemView({ formId: 'add-item-form' });
        new ItemListView({ elId: 'added-items-wrapper', listId: 'added-items-list' });
    }
}
