const Model = require("../model");

class File extends Model {
    constructor(fileName, fileURI, owner) {
        super("files");

        this.fileName = fileName;
        this.fileURI = fileURI;
        this.owner = owner;

        this.uploadedAt = new Date();
    }
}

module.exports = File;
