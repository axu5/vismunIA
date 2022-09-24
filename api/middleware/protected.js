const jwt = require("jsonwebtoken");
const Tokens = require("../models/tokens");
const User = require("../models/user");

module.exports = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = req.cookies;
        if (!refreshToken) throw "bad request";
        if (accessToken) {
            console.log("IHM??");
            // @ts-ignore
            const { aud: userId } = jwt.decode(accessToken);

            if (!userId) throw "bad request";

            req.userId = userId;
            const user = await User.load({ userId });
            req.user = user;
            return next();
        }

        const userId = await Tokens.verifyRefreshToken(refreshToken);
        req.userId = userId;
        const user = await User.load({ userId });
        req.user = user;
        return next();
    } catch (error) {
        res.status(400);
        next();
    }
};
