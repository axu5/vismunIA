const Model = require("../model");

class Session extends Model {
    constructor(date, room, topic, time, length) {
        super("sessions");

        this.date = date;
        this.room = room;
        this.topic = topic;
        this.time = time;
        this.length = length;
    }
}

module.exports = Session;
