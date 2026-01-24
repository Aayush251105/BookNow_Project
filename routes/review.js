const express = require("express");
const router = express.Router({mergeParams: true});

// importing 
const wrapAsync = require("../utils/wrapAsync.js");

// DB model
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

// middleware 
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

// controller
const reviewController = require("../controllers/reviews.js");

// Phase 2 - reviews & Auth
// 1. Post Review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// 2. Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;