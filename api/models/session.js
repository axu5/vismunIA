const DBManager = require("../dbManager");

class Session extends DBManager {
    static collectionName = "sessions";
    constructor(date, room, topic, time, length) {
        super(Session.collectionName);

        this.date = date;
        this.room = room;
        this.topic = topic;
        this.time = time;
        this.length = length;
    }
}

module.exports = Session;
