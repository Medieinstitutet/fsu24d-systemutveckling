import DatabaseObject from "./DatabaseObject.js";
import LineItem from "./LineItem.js";

export default class LineItemsObject extends DatabaseObject {
    constructor() {
        super();

        this.lineItems = [];
    }

    getBaseSaveData() {
        return {};
    }

    addLineItemsToSaveData(saveData) {
        saveData["lineItems"] = this.lineItems;
    }

    getSaveData() {
        let saveData = this.getBaseSaveData();

        this.addLineItemsToSaveData(saveData);

        return saveData;
    }

    addProduct(product, amount) {
        let newLineItem = new LineItem(product, amount);
        newLineItem.owner = this;
        this.lineItems.push(newLineItem);

        return newLineItem;
    }

    removeLineItem(lineItem) {
        this.lineItems.splice(this.lineItems.indexOf(lineItem), 1);
    }

    removeProduct(id) {
        for(let i = 0; i < this.lineItems.length; i++) {
            if(this.lineItems[i].id === id) {
                this.lineItems.splice(i, 1);
                break;
            }
        }
    }

    changeQuantity(id, quantity) {
        //METODO: implement this
    }
}