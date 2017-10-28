import {
    EL_ADDED,
    ITEM_LIST_CLICKED,
    MART_CTRL_GET_TOTAL_COST,
    MART_CTRL_SET_TOTAL_COST,
    } from '../js/mart/const/events';
import MartCtrl from '../js/mart/controllers/mart-controller';
import ItemModelList from '../js/mart/models/item-model-list';
import events from '../js/utils/events';
import EventEmitter from 'events';

describe('Mart controller suite', function() {

    it('should init listeners when new instance is created', () => {
        spyOn(MartCtrl.prototype, 'initListeners');

        new MartCtrl();

        expect(MartCtrl.prototype.initListeners).toHaveBeenCalled();
    });

    it('should add item to item list with correct data when element added event is triggered', () => {
        const itemDataObj = { item: 1 };
        spyOn(MartCtrl.prototype, 'addItemToList').and.callThrough();
        spyOn(ItemModelList.prototype, 'add');

        new MartCtrl();
        events.emit(EL_ADDED, itemDataObj);

        expect(MartCtrl.prototype.addItemToList).toHaveBeenCalled();
        expect(ItemModelList.prototype.add).toHaveBeenCalledWith(itemDataObj);
    });

    it('should update selected item when item list is triggered', () => {
        const clickedItemObj = {
            index: '0',
        };
        spyOn(MartCtrl.prototype, 'updateSelectedItems').and.callThrough();
        spyOn(ItemModelList.prototype, 'updateItem');

        new MartCtrl();
        events.emit(ITEM_LIST_CLICKED, clickedItemObj);

        expect(MartCtrl.prototype.updateSelectedItems).toHaveBeenCalled();
        expect(ItemModelList.prototype.updateItem).toHaveBeenCalled();
    });

    it('should get total items cost when total cost event is triggered and emit evenit with total cost', ()=> {
        events.on(MART_CTRL_SET_TOTAL_COST, (res) => {
            expect(res).toEqual(0);
        });
        spyOn(MartCtrl.prototype, 'getTotalSelectedItemsCost').and.callThrough();

        new MartCtrl();
        events.emit(MART_CTRL_GET_TOTAL_COST);

        expect(MartCtrl.prototype.getTotalSelectedItemsCost).toHaveBeenCalled();
    });

    it('should calculate total item cost correctly', () => {
        const itemData = {
            cost: 10,
            discount: 1,
            shipping: 2,
            tax: 3,
        };
        const cost = itemData.cost - itemData.discount + itemData.shipping + itemData.tax;

        expect(MartCtrl.getItemCost(itemData)).toEqual(cost);
    });

});
