const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const PORT = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/staybnb";
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

// Database connection
main().then(res => {
    console.log("Connected To DB");
}).catch(err => {
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

// Configurations
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// functions -
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((err) => err.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Root Route
app.get("/", (req, res) => {
    res.send("Root");
});

// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
})); 
 
// Create Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    await Listing.create(req.body.listing);
    console.log("Data Stored in DB");
    res.redirect("/listings");
})); 

// Update Route 
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing, { runValidators: true });
    console.log("Update Successful");
    res.redirect(`/listings/${id}`);
}));

// Destroy Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    console.log("Listing Deleted!");
    res.redirect("/listings");
}));

// Read Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
})); 

// Handling Page not found -
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error Handling Midlleware
app.use((err, req, res, next) => { 
    let { statusCode = 500, message = "Internal Server Error" } = err;
    res.status(statusCode).render("errors/error.ejs", { statusCode, message });
});

app.listen(PORT, () => {
    console.log("Server is running");
});