module.exports = function isLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session);
        req.flash("error", "You must be logged in, to perform this action");
        return res.redirect("/login");
    }
    return next();
} 