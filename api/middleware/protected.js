const jwt = require("jsonwebtoken");
const Tokens = require("../models/tokens");
const User = require("../models/user");

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
        const user = new User();
        await user.load({ userId });
        req.user = user;
        return next();
    } catch (error) {
        return res.status(400);
    }
};
