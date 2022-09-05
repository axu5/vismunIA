const express = require("express");
const app = express();
const db = require("./db");
const User = require("./models/user");

app.use(express.json());

app.get("/", async (req, res) => {
    res.send("hello world!");
});

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
        return res.status(400).send({
            error: "Name, email, and password must be provided",
        });
    }

    if (email.includes(" ") || !email.endsWith("@verdala.org")) {
        return res.status(400).send({
            error: "Invalid email, must be a valid verdala email address",
        });
    }

    const users = db.getCollection("users");

    const existingUser = await users.findOne({
        email,
    });

    if (existingUser) {
        return res.status(400).send({
            error: "User with that email or name already exists",
        });
    }

    const user = new User(name, email);
    await user.setPassword(password);
    await user.save();

    res.send("success");
});

app.listen(3000, async () => {
    console.log("server started");
    await db.load();
});
