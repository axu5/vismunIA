const bcrypt = require("bcrypt");
const DBManager = require("../dbManager");
const { v4: uuid } = require("uuid");

class User extends DBManager {
    static collectionName = "users";

    /**
     * @param {string | undefined} name
     * @param {any | undefined} email
     * @param {string | undefined} password
     * @param {number | undefined} graduationYear
     */
    constructor(
        name = "",
        email = "",
        password = "",
        graduationYear = 0
    ) {
        super(User.collectionName);
        this.name = name;
        this.pw = "";
        this.password = password;
        this.graduationYear = graduationYear;

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

    /**
     * @param {string | Buffer} plainTextPassword
     */
    verifyPassword(plainTextPassword) {
        return bcrypt.compareSync(plainTextPassword, this.pw);
    }

    /**
     * Hash the password when set
     * @param {string} password
     */
    set password(password) {
        this.pw = bcrypt.hashSync(password, 12);
    }

    /**
     * Sets first name and last name
     * @param {string} fullName
     */
    set name(fullName) {
        const nameArray = fullName.split(" ");
        this.firstName = nameArray[0];
        this.lastName = nameArray[nameArray.length - 1];
    }

    /**
     * Get the full name of the user
     * @returns {string} Returns full name
     */
    get name() {
        return `${this.firstName} ${this.lastName}`;
    }

    static async load(query) {
        const user = new User();
        const success = await user.load(query);

        return success ? user : null;
    }
}

module.exports = User;
