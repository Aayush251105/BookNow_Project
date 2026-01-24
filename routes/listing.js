const express = require("express");
const router = express.Router();

// importing
const wrapAsync = require("../utils/wrapAsync.js");

// DB Models
const Listing = require("../models/listing.js");

// cloudinary
const { storage } = require("../cloudConfig.js");

// Multer - processing image files
const multer = require("multer");
const upload = multer({ storage });

// middlewares
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// Controller
const listingController = require("../controllers/listings.js");

// routing with router.route

// 1. index route & 4. create route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.createListing),
  );

// 3. New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// 8. Search route 
router.get("/destination", listingController.searchListing);

// Show route , Update route , delete route.
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.updateListings),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// 5. Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

// 9. Filter route
router.get("/filter/:id", listingController.filterListing);

module.exports = router;
