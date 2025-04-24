import LineItemsObject from "./LineItemsObject.js";

export default class Order extends LineItemsObject {
    constructor() {
        super();
    }

    getCollection() {
        return "orders";
    }
}