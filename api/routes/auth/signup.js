const validEmail = require("../../helpers/validEmail");
const Tokens = require("../../models/tokens");
const User = require("../../models/user");

module.exports = async (req, res) => {
    const { name, email, graduationYear, password } = req.body;

    if (!(name && email && password && graduationYear)) {
        return res.send({
            error: "Name, email, password, and graduation year must be provided",
        });
    }

    if (!validEmail(email)) {
        return res.send({
            error: "Invalid email, must be a valid verdala email address",
        });
    }

    if (graduationYear < new Date().getFullYear()) {
        return res.send({
            error: "Invalid graduation year",
        });
    }

    const existingUser = await User.load({ email });

    if (existingUser != null) {
        return res.send({
            error: "User with that email already exists",
        });
    }

    console.log("new user...");
    const user = new User(name, email, password, graduationYear);

    // Create tokens
    console.log("tokens...");
    const tokens = new Tokens(user.userId);
    tokens.setTokens(res);
    tokens.save();

    console.log("saving...");
    await user.save();
    res.send({ success: true });
};
