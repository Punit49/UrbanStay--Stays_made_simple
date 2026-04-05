const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing } = require("../middlewares/validation.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const isListingOwner = require("../middlewares/isListingOwner.js");
const listingController = require("../controllers/listingController.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // automatically creates uploads folder

router.route("/")
    .get(wrapAsync(listingController.getAllListings))
    .post(isLoggedIn, validateListing, upload.single("listing[image]"), wrapAsync(listingController.createListing)); 
  
router.get("/new", isLoggedIn, listingController.getCreateForm);

router.get("/:id/edit", isLoggedIn, isListingOwner, wrapAsync(listingController.getEditForm));

router.route("/:id") 
    .get(wrapAsync(listingController.readListing))
    .put(isLoggedIn, isListingOwner, validateListing, upload.single("listing[image]"), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isListingOwner, wrapAsync(listingController.deleteListing));

module.exports = router;