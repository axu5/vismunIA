const DBManager = require("../dbManager");

class File extends DBManager {
    static collectionName = "files";

    constructor(fileName, fileURI, owner) {
        super(File.collectionName);

        this.fileName = fileName;
        this.fileURI = fileURI;
        this.owner = owner;

        this.uploadedAt = new Date();
    }
}

module.exports = File;
