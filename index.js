const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const db = require("./db");
// const User = require("./models/user");
const auth = require("./routes/auth");
const dashboard = require("./routes/dashboard");

app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
    res.send("hello world!");
});

app.use("/auth", auth);
app.use("/dashboard", dashboard);

// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     // get user
//     const user = new User();
//     user.load({ email });

//     // if email or password is wrong, display same error message
//     if (!user || user.verifyPassword(password)) {
//         return res.json({
//             error: "Incorrect email or password",
//         });
//     }

//     // set refresh token
// });

app.listen(3000, async () => {
    console.log("server started");
    await db.load();
});
