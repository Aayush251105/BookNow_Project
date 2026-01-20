const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const ExpressError = require("./utils/ExpressError.js");
// Express session
const session = require("express-session");
const flash = require("connect-flash"); // connect flash to flash msgs onces something is done then remove when refreshed

// Passport - Auth
const passport = require("passport");
const LocalStrategy = require("passport-local");

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
const User = require("./models/user.js");

// ejs setups
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // time in millisec - 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevents cross scripting attacks
  },
};

// MIDDLEWARES
// session middleware
app.use(session(sessionOptions));
// flash middleware
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); // adds user info in session
passport.deserializeUser(User.deserializeUser()); // removes info from session

// ROUTE / API
app.get("/", (req, res) => {
  res.send("ROOT");
});

// MIDDLEWARES
// flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;   // storing login user info in res.locals
  next();
});


// Phase 1 - Listing & UI
// listing routes - using express routing
const listingRoter = require("./routes/listing.js");
app.use("/listings", listingRoter);

// Phase 2 - reviews & Auth
// Review routes - using express routing
const reviewRoter = require("./routes/review.js");
app.use("/listings/:id/reviews", reviewRoter);

// Sign-in & Sign-up route
const userRouter = require("./routes/user.js");
app.use("/", userRouter);

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
