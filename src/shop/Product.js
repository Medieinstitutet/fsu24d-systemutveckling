import DatabaseObject from "./DatabaseObject.js";

import client from "../DatabaseConnection.js";

export default class Product extends DatabaseObject {
    constructor() {
        super();

        this.name = null;
        this.price = 0;
    }

    getCollection() {
        return "products";
    }

    getName() {
        return this.name;
    }

    getPrice() {
        return this.price;
    }

    getImage() {
        //METODO
    }

    setupFromDatabase(data) {
        this.name = data.name;
        this.price = data.price;
    }

    getSaveData() {
        return {"name": this.name, "price": this.price};
    }

    static async getAll() {
        let items = await client.findAll("products");

        let products = items.map((data) => {
            let newProduct = new Product();

            newProduct.id = data._id;
            newProduct.setupFromDatabase(data);

            return newProduct;
        });

        return products;
    }

    static async getById(id) {
        let newItem = new Product();
        newItem.id = id;
        await newItem.load();

        return newItem;
    }
}