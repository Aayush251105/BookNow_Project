const express = require("express");
const router = express.Router({mergeParams: true});

// importing 
const wrapAsync = require("../utils/wrapAsync.js");

// DB model
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

// middleware 
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
// Phase 2 - reviews & Auth
// 1. Post Review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body);

    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  })
);

// 2. Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    // $pull pulls all the elements in an array that matches the value
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findById(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;