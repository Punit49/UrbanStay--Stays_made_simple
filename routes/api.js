const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listingController.js");

router.get("/listings", listingController.getCategoryJSONListing);

module.exports = router;