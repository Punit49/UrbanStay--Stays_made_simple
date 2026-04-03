const Listing = require("../models/listing.js");

module.exports.getAllListings = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
};

module.exports.getCreateForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    req.body.listing.owner = req.user._id;
    await Listing.create(req.body.listing);
    console.log("Data Stored in DB");
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.getEditForm = async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Does Not Exists!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    const id = req.params.id;
    const listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing, { runValidators: true });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => { // Coressponding middleware in listing.js
    const id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}

module.exports.readListing = async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author"
        }    
    }).populate("owner");
    if(!listing){
        req.flash("error", "Listing Does Not Exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}