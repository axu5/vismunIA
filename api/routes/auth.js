const express = require("express");
const router = express.Router();
const protected = require("../middleware/protected");
const signup = require("./auth/signup");
const login = require("./auth/login");
const logout = require("./auth/logout");
const logoutAll = require("./auth/logoutAll");

router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", protected, logout);
router.delete("/logout-all", protected, logoutAll);

module.exports = router;
