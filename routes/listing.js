const express = require("express");
const router = express.Router();

// importing
const wrapAsync = require("../utils/wrapAsync.js");

// DB Models
const Listing = require("../models/listing.js");


// middlewares
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// 1. index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

// 3. New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// 2. show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    // nested populate
    const listing = await Listing.findById(id)
      .populate({path: "reviews", populate: {
        path: "author",
      },})
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing dose not Exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }),
);

// 4. create route
// using error handeller & asyncWrap
router.post(
  "/",
  isLoggedIn,
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
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }),
);

// 5. Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing dose not Exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }),
);

// 6. Update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }),
);

// 7. Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }),
);

module.exports = router;
