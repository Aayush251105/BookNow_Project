const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
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

// ROUTE / API
app.get("/", (req, res) => {
  res.send("ROOT");
});

// Phase 1 - Listing & UI
// listing routes - using express routing
const listings = require("./routes/listing.js");
app.use("/listings", listings);

// Phase 2 - reviews & Auth
// Review routes - using express routing
const reviews = require("./routes/review.js");
app.use("/listings/:id/reviews", reviews);

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
