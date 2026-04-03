const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview } = require("../middlewares/validation.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const isReviewAuthor = require("../middlewares/isReviewAuthor.js");
const reviewController = require("../controllers/reviewsController.js");

// Reviews Route 
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;