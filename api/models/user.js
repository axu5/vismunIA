const bcrypt = require("bcrypt");
const Model = require("../model");
const { v4: uuid } = require("uuid");

class User extends Model {
    constructor(name, email) {
        super("users");

        this.name = name;
        this.email = email;
        this.userId = uuid();
        this.password = "";

        this.createdAt = new Date();

        this.files = [];
        this.attendance = [];

        this.student = true;
        this.secretaryGeneral = false;
        this.teacher = false;
    }

    setPassword(password) {
        this.password = bcrypt.hashSync(password, 12);
    }

    verifyPassword(plainTextPassword) {
        return bcrypt.compareSync(plainTextPassword, this.password);
    }
}

module.exports = User;
