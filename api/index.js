const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const db = require("./db");
// const User = require("./models/user");
const auth = require("./routes/auth");
const dashboard = require("./routes/dashboard");
const morgan = require("morgan");

const logger = morgan(":method :url :status - :response-time ms");

app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
    res.send("hello world!");
});

app.use("/auth", auth);
app.use("/dashboard", dashboard);

app.listen(3000, async () => {
    console.log("server started");
    await db.load();
});
