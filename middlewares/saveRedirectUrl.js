module.exports = function saveRedirectUrl(req, res, next){
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    return next();
};
