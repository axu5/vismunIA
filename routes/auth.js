const express = require("express");
const router = express.Router();
const db = require("../db");
const Tokens = require("../models/tokens");
const User = require("../models/user");

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
        return res.send({
            error: "Name, email, and password must be provided",
        });
    }

    if (!validEmail(email)) {
        return res.send({
            error: "Invalid email, must be a valid verdala email address",
        });
    }

    const users = db.getCollection("users");

    const existingUser = await users.findOne({
        email,
    });

    if (existingUser) {
        return res.send({
            error: "User with that email or name already exists",
        });
    }

    const user = new User(name, email);
    await user.setPassword(password);

    // Create tokens
    const tokens = new Tokens(user.userId);
    tokens.setTokens(res);
    tokens.save();

    await user.save();
    res.send("success");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send({ error: "No email or password provided" });
    }

    if (!validEmail(email)) {
        return res.send({ error: "Invalid verdala email" });
    }

    // check that email and password are valid
    const user = new User();
    await user.load({ email });
    if (!user.name || !user.verifyPassword(password)) {
        return res.send({ error: "Invalid email or password" });
    }

    const tokens = new Tokens(user.userId);
    tokens.setTokens(res);

    res.send({ success: true });
});

router.post("/refresh-token", async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) throw "bad request";

        await Tokens.verifyRefreshToken(refreshToken);
    } catch (error) {
        next(error);
    }
});

router.delete("/logout", async (req, res) => {
    Tokens.delete(res);
    res.send({ success: true });
});

router.delete("/logout-all", async (req, res) => {});

function validEmail(email) {
    return !email.includes(" ") && email.endsWith("@verdala.org");
}

module.exports = router;
