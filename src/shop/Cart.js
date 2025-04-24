import LineItemsObject from "./LineItemsObject.js";

export default class Cart extends LineItemsObject {
    constructor() {
        super();
    }

    getCollection() {
        return "carts";
    }
}