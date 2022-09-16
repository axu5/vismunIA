const DBManager = require("../dbManager");

class Topic extends DBManager {
    static collectionName = "topics";

    constructor(name, session) {
        super(Topic.collectionName);

        this.name = name;
        this.session = session;

        this.countries = {};
    }

    addCountry(country) {
        this.countries[country] = {
            name: country,
            members: [],
            files: [],
        };
    }

    addMember(country, member) {
        if (!this.countries[country]) {
            this.addCountry(country);
        }

        this.countries[country].members.push(member);
    }

    addFile(country, file) {
        if (!this.countries[country]) {
            this.addCountry(country);
        }

        this.countries[country].members.push(file);
    }
}

module.exports = Topic;
