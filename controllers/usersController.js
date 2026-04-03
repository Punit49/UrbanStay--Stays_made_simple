const User = require("../models/user.js");
const passport = require("passport");

module.exports.getSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
      const { email, password, username } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);

      // Making user automatically login when they sign up   
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
};

module.exports.getLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res, next) => {
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
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if(err){
      return next(err);
    }
    req.flash("success", "Logged Out Successfully");
    res.redirect("/listings");
  })
};