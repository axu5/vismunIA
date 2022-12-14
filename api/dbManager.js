const db = require("./db");
// const User = require("./models/user");

class DBManager {
    /**
     * @param {string} collectionName
     */
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.exclude = [];

        // All attributes have to be defined before adding
        // it to the excluded list
        this.exclude = ["collectionName", "exclude"];
    }

    /**
     * Save to database collection
     */
    async save() {
        const collection = db.getCollection(this.collectionName);
        const copy = {};
        for (const [key, value] of Object.entries(this)) {
            if (this.exclude.includes(key)) continue;
            copy[key] = value;
        }
        collection.insertOne(copy);
    }

    /**
     * Exclude a specific attribute of the class from being saved to the database
     * @param {string} param
     */
    excludeParam(param) {
        this.exclude.push(param);
    }

    /**
     * Load variables into instance from database
     * @param {Object} query The MongoDB query
     */
    async load(query) {
        const collection = db.getCollection(this.collectionName);

        const data = await collection.findOne(query);
        if (data == null) return false;

        for (const [key, value] of Object.entries(data)) {
            if (key === "_id") continue;
            this[key] = value;
        }

        return true;
    }

    static async getCollection(collectionName, query) {
        const collection = db.getCollection(collectionName);
        const data = await collection.findOne(query);

        return data;
    }
}

module.exports = DBManager;
