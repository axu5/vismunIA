const db = require("./db");

class Model {
    constructor(collection) {
        this.collectionName = collection;
        this.exclude = ["collectionName", "exclude"];
    }

    async save() {
        const collection = db.getCollection(this.collectionName);
        const copy = {};
        for (const [key, value] of Object.entries(this)) {
            if (this.exclude.includes(key)) continue;
            copy[key] = value;
        }
        collection.insertOne(copy);
    }

    excludeParam(param) {
        this.exclude.push(param);
    }

    /**
     * @param {Object} query The MongoDB query
     */
    async load(query) {
        const collection = db.getCollection(this.collectionName);
        const data = await collection.findOne(query);
        for (const [key, value] of Object.entries(data)) {
            if (key === "_id") continue;
            this[key] = value;
        }
    }
}

module.exports = Model;
