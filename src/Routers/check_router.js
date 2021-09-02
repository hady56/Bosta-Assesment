const express = require("express");
const body = require("express-validator").body;
const checkController = require("../Controllers/check_controller");
const passport = require("passport");
const authenticate = require("../authenticate");
const router = express.Router();

router.post("/newcheck", authenticate.verifyUser,checkController.addNewCheck);

module.exports = router;
