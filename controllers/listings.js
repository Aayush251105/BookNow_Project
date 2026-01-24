const Listing = require("../models/listing");
// mapbox sdk
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// saving all the callbacks

// 1. index route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// 3. new route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// 2. show route
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  // nested populate
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing dose not Exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

//  4. Create route
module.exports.createListing = async (req, res, next) => {
  // Geo Coding
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let { title, description, image, price, country, location, category } = req.body;
  const newlisting = new Listing({
    title,
    description,
    image,
    price,
    country,
    location,
    category
  });
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  // GeoCoordinates
  newlisting.geometry = response.body.features[0].geometry;
  let savedListing = await newlisting.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//   5. Edit route
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing dose not Exist!");
    res.redirect("/listings");
  }
  // Preview image
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// 6. Update route
module.exports.updateListings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//   7. Destroy route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

//  8. Search Route
module.exports.searchListing = async(req,res) => {
  let name = req.query.search;
  let allListings = await Listing.find({country: name});
  res.render("listings/search.ejs", {allListings , name})
}

// 9. filter route
module.exports.filterListing = async(req,res)=> {
  let {id} = req.params;
  id = id.replaceAll("+"," ")
  // console.log(id);
  const allListings = await Listing.find({category: id});
  // console.log(allListings);
  if(!allListings){
    allListings = [];
  }
  res.render("listings/index.ejs", {allListings});
}