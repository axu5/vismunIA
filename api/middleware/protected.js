const jwt = require("jsonwebtoken");
const Tokens = require("../models/tokens");

module.exports = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = req.cookies;
        if (accessToken) {
            // @ts-ignore
            const { aud: userId } = jwt.decode(accessToken);

            if (!userId) throw "bad request";

            req.userId = userId;
            return next();
        }

        if (!refreshToken) throw "bad request";
        const userId = await Tokens.verifyRefreshToken(refreshToken);
        req.userId = userId;
        return next();
    } catch (error) {
        res.send(error);
    }
};
