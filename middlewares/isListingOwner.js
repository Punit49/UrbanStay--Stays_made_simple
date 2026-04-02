const Listing = require("../models/listing.js");

module.exports = async function isListingOwner(req, res, next){
    try{
        const listing = await Listing.findById(req.params.id);
        if(!listing.owner.equals(req.user._id)){
            req.flash("error", "Access Denied");
            return res.redirect("/listings");
        }
        return next();
    } catch(err){
        console.error(err);
    }
} 