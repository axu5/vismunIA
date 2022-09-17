const validEmail = require("../../helpers/validEmail");
const Tokens = require("../../models/tokens");
const User = require("../../models/user");

module.exports = async (req, res) => {
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
    // await user.load({ email });
    if (!user.name || !user.verifyPassword(password)) {
        return res.send({ error: "Invalid email or password" });
    }

    const tokens = new Tokens(user.userId);
    await tokens.updateVersion();
    console.log("Token version:", tokens.version);
    tokens.setTokens(res);

    res.send({ success: true });
};
