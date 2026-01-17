const express = require("express");
const router = express.Router({mergeParams: true});

// importing 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

// DB model
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

// server side Validation check for - listings , reviews
const { reviewSchema } = require("../schema.js");

const validateReview = (req, res, next) => {
  // validating based on Schema
  console.log(req.body);
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// Phase 2 - reviews & Auth
// 1. Post Review route
router.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");

    res.redirect(`/listings/${listing._id}`);
  })
);

// 2. Delete Review Route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    // $pull pulls all the elements in an array that matches the value
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findById(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;