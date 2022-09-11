const express = require("express");
const router = express.Router();
const protected = require("../middleware/protected");

router.use(protected);

router.get("/", (req, res) => {
    // @ts-ignore
    res.send({ userId: req.userId });
});

module.exports = router;
