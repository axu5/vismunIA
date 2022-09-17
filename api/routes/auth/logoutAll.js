const Tokens = require("../../models/tokens");

module.exports = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) throw "bad request";
        await Tokens.verifyRefreshToken(refreshToken);
        // update refresh token version
        await Tokens.updateVersion(refreshToken);
        // delete cookies from client
        Tokens.delete(res);

        res.send({ success: true });
    } catch (error) {
        next(error);
    }
};
