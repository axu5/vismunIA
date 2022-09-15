const bcrypt = require("bcrypt");
const Model = require("../model");
const { v4: uuid } = require("uuid");

class User extends Model {
    constructor(name, email) {
        super("users");
        this.name = name;
        this.graduationYear = undefined;

        this.email = email;
        this.userId = uuid();
        this.password = "";

        this.createdAt = new Date();

        this.files = [];
        this.attendance = 0;

        this.student = true;
        this.secretaryGeneral = false;
        this.teacher = false;
    }

    verifyPassword(plainTextPassword) {
        return bcrypt.compareSync(plainTextPassword, this.password);
    }

    set password(password) {
        this.password = bcrypt.hashSync(password, 12);
    }

    set name(name) {
        name = name.split(" ");
        this.firstName = name[0];
        this.lastName = name[1];
    }
}

module.exports = User;
