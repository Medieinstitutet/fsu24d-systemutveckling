import client from "../DatabaseConnection.js";

export default class DatabaseObject {
    constructor() {
        this.id = null;
    }

    getCollection() {
        return null;
    }

    save() {
        //METODO: implement this
    }

    async getDatabaseData() {
        let data = await client.findAll(this.getCollection(), {"_id": this.id});
        return data;
    }

    setupFromDatabase(data) {
        //MENOTE: will be overridden
        console.warn("setupFromDatabase should be overriden", this);
    }

    async load() {
        let data = await this.getDatabaseData();
        this.setupFromDatabase(data[0]);

        console.log(this);
    }
}