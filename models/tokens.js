const Model = require("../model");
const jwt = require("jsonwebtoken");
const db = require("../db");

const {
    // @ts-ignore
    tokens: { refreshKey, accessKey: tokenKeys },
} = require("../config.json");

const tokenNames = {
    access: "accessToken",
    refresh: "refreshToken",
};

class Tokens extends Model {
    static accessTokenExpiresIn = 5000;
    static refreshTokenExpiresIn = 31536000000; // 365 * 24 * 60 * 60 * 1000;

    /**
     * When the Tokens object is first created it will
     * automatically sign new access and refresh tokens,
     * that can later be retrieved from the public variables
     *
     * If the userId already exists in the user_sessions
     * database, then the user will be retrieved
     *
     * @param {string} userId the id of the user for storing in database and prevention of duplicating token
     */
    constructor(userId) {
        super("user_sessions");
        super.excludeParam("refreshToken");
        super.excludeParam("accessToken");

        this.userId = userId;

        this.version = 0;

        // Create tokens
        const refreshPayload = {
            version: this.version,
        };
        const accessPayload = {};

        // Options
        const refreshOptions = {
            expiresIn: Tokens.refreshTokenExpiresIn,
            audience: userId,
        };
        const accessOptions = {
            expiresIn: Tokens.accessTokenExpiresIn,
            audience: userId,
        };

        // Add access and refresh tokens to the instance
        this.refreshToken = jwt.sign(
            refreshPayload,
            refreshKey,
            refreshOptions
        );
        this.accessToken = jwt.sign(
            accessPayload,
            tokenKeys,
            accessOptions
        );
    }

    setTokens(res) {
        res.cookie(tokenNames.refresh, this.refreshToken, {
            maxAge: Tokens.refreshTokenExpiresIn,
            httpOnly: true,
        });
        res.cookie(tokenNames.access, this.accessToken, {
            maxAge: Tokens.accessTokenExpiresIn,
            httpOnly: true,
        });
    }

    /**
     * @param {string} refreshToken
     *
     * @returns {Promise<boolean>} Valid token
     */
    static verifyRefreshToken(refreshToken) {
        return new Promise((resolve, reject) => {
            jwt.verify(
                refreshToken,
                refreshKey,
                async (error, payload) => {
                    if (error) {
                        return reject(
                            "unauthorized (incorrect token)"
                        );
                    }
                    // Extract userId from audience
                    const userId = payload.aud;
                    // @ts-ignore
                    const { version } = jwt.decode(
                        refreshToken,
                        refreshKey
                    );

                    // Check that refresh token version is correct
                    // 1. Get correct token version from DB
                    const token = new Tokens(userId);
                    await token.load({ userId });
                    // 2. If token versions do not match return unauthorized
                    if (token.version !== version) {
                        return reject("unauthorized (token version)");
                    }

                    // Return the userId
                    return resolve(userId);
                }
            );
        });
    }

    static delete(res) {
        res.cookie(tokenNames.access, "");
        res.cookie(tokenNames.refresh, "");
    }
}

module.exports = Tokens;
