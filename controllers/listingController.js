const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Listing = require("../models/listing.js");
const axios = require("axios");

module.exports.getAllListings = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
};

module.exports.getCreateForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    const url = req.file.path;
    const filename = req.file.filename;
    req.body.listing.owner = req.user._id;
    req.body.listing.image = {url, filename};
    const listing = await Listing.create(req.body.listing);
    
    let response = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.LOCATION_IQ_API_KEY}&q=${encodeURIComponent(listing.location + " " + listing.country)}&format=json&limit=1`);

    const {lat, lon } = response.data[0];
    listing.cordinates = {lat, lon}; 
    await listing.save();

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

    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/h_250,w_250");
    res.render("listings/edit.ejs", { listing, originalImgUrl });
}

module.exports.updateListing = async (req, res) => {
    const id = req.params.id;    
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { runValidators: true });

    if(typeof req.file !== "undefined"){
        const url = req.file.path;
        const filename = req.file.originalname;
        listing.image = { url, filename };
        await listing.save();
    }

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