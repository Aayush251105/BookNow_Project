const express = require("express");
const router = express.Router();

// importing 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

// DB Models
const Listing = require("../models/listing.js");

// server side Validation check for - listings , reviews
const { listingSchema} = require("../schema.js");

const validateListing = (req, res, next) => {
  // validating based on schema
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400,error);
  } else {
    next();
  }
};

// 1. index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// 3. New Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// 2. show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// 4. create route
// using error handeller & asyncWrap
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { title, description, image, price, country, location } = req.body;
    const newlisting = new Listing({
      title,
      description,
      image,
      price,
      country,
      location,
    });
    await newlisting.save();
    res.redirect("/listings");
  })
);

// 5. Edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// 6. Update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/listings/${id}`);
  })
);

// 7. Delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

module.exports = router;
