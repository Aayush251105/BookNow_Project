const ExpressError = require("./utils/ExpressError.js");
// server side Validation check for - listings , reviews
const { listingSchema } = require("./schema.js");

module.exports.validateListing = (req, res, next) => {
  // validating based on schema
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};


// server side Validation check for - listings , reviews
const { reviewSchema } = require("./schema.js");

module.exports.validateReview = (req, res, next) => {
  // validating based on Schema
  console.log(req.body);
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};


module.exports.isLoggedIn = (req , res , next) => {
    if (!req.isAuthenticated()) {
        // redirect URL if not loggedin
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

// saving it to locals as after login the session store is refreshed
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const Listing = require("./models/listing.js");

module.exports.isOwner = async(req,res,next) => {
    // Authorization
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (listing.owner._id.equals(res.locals.currUser._id)) {
      req.flash("error", "You do not have permission");
      return res.redirect(`/listings/${id}`);
    }

    next();
}

const Review = require("./models/reviews.js");
module.exports.isReviewAuthor = async(req,res,next) => {
    // Authorization
    let { id ,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }

    next();
}