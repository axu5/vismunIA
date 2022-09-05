const bcrypt = require("bcrypt");
const Model = require("../model");

class User extends Model {
    constructor(name, email) {
        super("users");

        this.name = name;
        this.email = email;
        this.password = "";

        this.createdAt = new Date();

        this.files = [];
        this.attendance = [];

        this.student = true;
        this.secretaryGeneral = false;
        this.teacher = false;
    }

    async setPassword(password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(password, salt);
    }
}

module.exports = User;
