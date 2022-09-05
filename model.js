const db = require("./db");

class Model {
    constructor(collection) {
        this.collection = collection;
    }

    async save() {
        const users = db.getCollection(this.collection);
        const copy = {};
        for (const [key, value] of Object.entries(this)) {
            if (key !== "collection") {
                copy[key] = value;
            }
        }
        users.insertOne(copy);
    }
}

module.exports = Model;
