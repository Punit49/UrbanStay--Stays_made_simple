const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing } = require("../middlewares/validation.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const isListingOwner = require("../middlewares/isListingOwner.js");
const listingController = require("../controllers/listingController.js");

// Index Route
router.get("/", wrapAsync(listingController.getAllListings)); 
  
// Create Route
router.get("/new", isLoggedIn, listingController.getCreateForm);

router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing)); 

// Update Route 
router.get("/:id/edit", isLoggedIn, isListingOwner, wrapAsync(listingController.getEditForm));

router.put("/:id", isLoggedIn, isListingOwner, validateListing, wrapAsync(listingController.updateListing));

// Destroy Route
router.delete("/:id", isLoggedIn, isListingOwner, wrapAsync(listingController.deleteListing));

// Read Route
router.get("/:id", wrapAsync(listingController.readListing)); 

module.exports = router;