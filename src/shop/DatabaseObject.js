import client from "../DatabaseConnection.js";

export default class DatabaseObject {
    constructor() {
        this.id = null;
    }

    getCollection() {
        return null;
    }

    getSaveData() {
        console.warn("Does not have save data", this);
        return {};
    }

    async save() {
        let collection = await client.getCollection(this.getCollection());
        let data = this.getSaveData();

        if(this.id) {
            await collection.updateOne({_id: this.id}, {$set: data})
        }
        else {
            let result = await collection.insertOne(data);

            this.id = result.insertedId;
        }
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