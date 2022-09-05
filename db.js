const { MongoClient } = require("mongodb");
const config = require("./config.json");

const { url } = config.db;
const client = new MongoClient(url);

const dbName = "vismunDB";

let cache = {};
async function load() {
    await client.connect();

    const db = client.db(dbName);

    const users = db.collection("users");
    const files = db.collection("files");
    const sessions = db.collection("sessions");
    const topics = db.collection("topics");

    cache = {
        users,
        files,
        sessions,
        topics,
    };
}

function getCollection(collection) {
    return cache[collection];
}

module.exports = {
    load,
    getCollection,
};
