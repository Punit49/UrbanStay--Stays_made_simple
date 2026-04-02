const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports = async function isReviewAuthor(req, res, next){
    try{
        const review = await Review.findById(req.params.reviewId);
        if(!review.author.equals(req.user._id)){
            req.flash("error", "Access Denied");
            return res.redirect("/listings");
        } 
        next();
    } catch(err){
        console.error(err);
    }
} 