const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listingController.js");

router.get("/listings", listingController.getCategoryJSONListing);
router.get("/listing", listingController.handleCategoryReload);
router.get("/search", listingController.searchListings);

module.exports = router;