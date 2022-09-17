const Tokens = require("../../models/tokens");

module.exports = async (_req, res) => {
    // delete cookies from client
    Tokens.delete(res);
    res.send({ success: true });
};
