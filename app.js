const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// connect to db
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/booknow");
}
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

// DB Models
const Listing = require("./models/listing.js");

// ejs setups
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// server side Validation check for - listings , reviews
const { listingSchema, reviewSchema } = require("./schema.js");

const validateListing = (req, res, next) => {
  // validating based on schema
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

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

// ROUTE / API
app.get("/", (req, res) => {
  res.send("ROOT");
});

// 1. index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// 3. New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// 2. show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// 4. create route
// using error handeller & asyncWrap
app.post(
  "/listings",
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
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// 6. Update route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/listings/${id}`);
  })
);

// 7. Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

// Phase 2 - reviews & Auth
// 1. Post Review route
// model
const Review = require("./models/reviews.js");
app.post(
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
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    // $pull pulls all the elements in an array that matches the value
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findById(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

// generic response - page not found
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error Handeller
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

// EJS mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

const port = 8080;
app.listen(port, () => {
  console.log("Server is listening at PORT: ", port);
});
