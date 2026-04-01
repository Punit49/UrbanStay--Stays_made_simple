const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const saveRedirectUrl = require("../middlewares/saveRedirectUrl.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async  (req, res) => {
      try {
        const { email, password, username } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
          if(err){
            return next(err);
          } 
          req.flash("success", `Welcome ${username}, to UrbanStay`);
          res.redirect("/listings");
        });
      } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
      }  
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {

    if (err) {
      req.flash("error", "Something went wrong");
      return next(err);
    }

    if (!user) {
      req.flash("error", info?.message || "Invalid credentials");
      return res.redirect("/login");
    }

    req.login(user, (err) => {
      if (err) {
        req.flash("error", "Login failed");
        return next(err);
      }

      req.flash("success", `Welcome back, ${user.username}`);
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    });

  })(req, res, next); 
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if(err){
      return next(err);
    }
    req.flash("success", "Logged Out Successfully");
    res.redirect("/listings");
  })
});

module.exports = router; 