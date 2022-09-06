const db = require("./db");

class Model {
    constructor(collection) {
        this.collection = collection;
    }

    async save() {
        const collection = db.getCollection(this.collection);
        const copy = {};
        for (const [key, value] of Object.entries(this)) {
            if (key !== "collection") {
                copy[key] = value;
            }
        }
        collection.insertOne(copy);
    }

    async load(query) {
        const collection = db.getCollection(this.collection);
        const data = collection.findOne(query);
        for (const [key, value] of Object.entries(data)) {
            if (key !== "_id") {
                this[key] = value;
            }
        }
    }
}

module.exports = Model;
