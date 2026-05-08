const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Listing = require("../models/listing.js");
const axios = require("axios");
const categories = require("../data/categoriesData.js");

module.exports.getListings = async (req, res) => { // fetches data for both - based on filter and for all 
    const filter = req.query.category ? { category: req.query.category } : {};
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings, categories });
};

module.exports.getCategoryJSONListing = async (req, res) => {
    const filter = req.query.category ? { category: req.query.category } : {};
    const categoryListings = await Listing.find(filter);
    res.json(categoryListings);
}

module.exports.searchListings = async (req, res) => {
    const query = req.query.q?.trim();

    if(!query) return res.json([]);
    
    const terms = query.split(",").map(item => item.trim()).filter(Boolean);
    const conditions = terms.flatMap(term => [
        {location: {$regex: term, $options: "i"}},
        {country: {$regex: term, $options: "i"}},
        {title: {$regex: term, $options: "i"}},
        {category: {$regex: term, $options: "i"}}
    ]);
    
    const searchedListings = await Listing.find({ $or: conditions });
    res.json(searchedListings); 
};

module.exports.handleCategoryReload = async (req, res) => {
    res.redirect("/listings");
}

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

    const {lat, lon} = response.data[0];
    listing.geometry.cordinates = [Number(lon), Number(lat)]; 
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
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { runValidators: true, new:true });

    if(typeof req.file !== "undefined"){
        const url = req.file.path;
        const filename = req.file.originalname;
        listing.image = { url, filename };
    }
    
    let response = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.LOCATION_IQ_API_KEY}&q=${encodeURIComponent(listing.location + " " + listing.country)}&format=json&limit=1`);
    console.log(response);

    const {lat, lon} = response.data[0];
    listing.geometry.cordinates = [Number(lon), Number(lat)]; 
    await listing.save();

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