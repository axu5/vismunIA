const { MongoClient } = require("mongodb");
const config = require("./config.json");

const { url, dbName } = config.db;
const client = new MongoClient(url);

let cache = {};
async function load() {
    await client.connect();

    const db = client.db(dbName);

    const collections = [
        "users",
        "files",
        "sessions",
        "topics",
        "user_sessions",
    ];

    for (const collectionName of collections) {
        cache[collectionName] = db.collection(collectionName);
    }
}

function getCollection(collectionName) {
    return cache[collectionName];
}

module.exports = {
    load,
    getCollection,
};
