const express = require("express");
const router = express.Router();
const protected = require("../middleware/protected");

router.use(protected);

router.get("/", (req, res) => {
    // @ts-ignore
    const { user } = req;
    res.send({ userId: user.userId, user });
});

module.exports = router;
