const express = require("express");
const router = express.Router({mergeParams: true});
const saveRedirectUrl = require("../middlewares/saveRedirectUrl.js");
const usersController = require("../controllers/usersController.js");

router.get("/signup", usersController.getSignUpForm);
router.post("/signup", usersController.signUp);
router.get("/login", usersController.getLoginForm);
router.post("/login", saveRedirectUrl, usersController.signUp);
router.get("/logout", usersController.logout);

module.exports = router; 