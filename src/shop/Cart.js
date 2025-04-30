import LineItemsObject from "./LineItemsObject.js";

export default class Cart extends LineItemsObject {
    constructor() {
        super();
    }

    getCollection() {
        return "carts";
    }

    static async getById(id) {
        let newItem = new Cart();
        newItem.id = id;
        await newItem.load();

        return newItem;
    }
}