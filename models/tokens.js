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
    static dataCollectionName = "user_sessions";

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
        super(Tokens.dataCollectionName);
        super.excludeParam("refreshToken");
        super.excludeParam("accessToken");

        this.userId = userId;

        this.version = 0;

        this.signRefreshToken();
        this.signAccessToken();
    }

    async updateVersion() {
        // Get version from database
        const sessionsCollection = db.getCollection(
            this.collectionName
        );
        const latestVersion = await sessionsCollection.findOne({
            userId: this.userId,
        });
        this.version = latestVersion.version;
        this.signRefreshToken();
    }

    signRefreshToken() {
        const refreshPayload = {
            version: this.version,
        };
        const refreshOptions = {
            expiresIn: Tokens.refreshTokenExpiresIn,
            audience: this.userId,
        };
        this.refreshToken = jwt.sign(
            refreshPayload,
            refreshKey,
            refreshOptions
        );
    }

    signAccessToken() {
        // Create tokens
        const accessPayload = {};

        // Options
        const accessOptions = {
            expiresIn: Tokens.accessTokenExpiresIn,
            audience: this.userId,
        };

        // Add access and refresh tokens to the instance
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

    static async updateVersion(token) {
        // @ts-ignore get user id
        const { aud: userId } = jwt.decode(token, refreshKey);
        // in sessions database increment version
        const sessionsCollection = db.getCollection(
            Tokens.dataCollectionName
        );
        const { version } = await sessionsCollection.findOne({
            userId,
        });
        await sessionsCollection.updateOne(
            { userId },
            { $set: { version: version + 1 } }
        );
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
                    // @ts-ignore Extract userId from audience
                    const userId = payload.aud;
                    // @ts-ignore
                    const { version } = jwt.decode(
                        refreshToken,
                        // @ts-ignore
                        refreshKey
                    );

                    // Check that refresh token version is correct
                    // 1. Get correct token version from DB
                    const correctTokenVersion =
                        await Tokens.getVersion(userId);
                    // 2. If token versions do not match return unauthorized
                    if (correctTokenVersion !== version) {
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

    static async getVersion(userId) {
        const sessionsCollection = db.getCollection("user_sessions");
        const result = await sessionsCollection.findOne({ userId });
        return result.version;
    }
}

module.exports = Tokens;
