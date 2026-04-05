const express = require("express");
const router = express.Router({mergeParams: true});
const saveRedirectUrl = require("../middlewares/saveRedirectUrl.js");
const usersController = require("../controllers/usersController.js");

router.route("/signup")
    .get(usersController.getSignUpForm)
    .post(usersController.signUp);

router.route("/login")
    .get(usersController.getLoginForm)
    .post(saveRedirectUrl, usersController.login);

router.get("/logout", usersController.logout);

module.exports = router; 