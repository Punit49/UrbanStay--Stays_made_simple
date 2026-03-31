const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateListing } = require("../middlewares/validation.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");

// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
})); 
 
// Create Route
router.get("/new", isLoggedIn, (req, res) => {
    console.log(789);
    res.render("listings/new.ejs");
});

router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    await Listing.create(req.body.listing);
    console.log("Data Stored in DB");
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
})); 

// Update Route 
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Does Not Exists!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing, { runValidators: true });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));

// Destroy Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => { // Coressponding middleware in listing.js
    const id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));

// Read Route
router.get("/:id", wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id).populate("reveiws");
    if(!listing){
        req.flash("error", "Listing Does Not Exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
})); 

module.exports = router;