const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
       type: String,
       default: "https://i.sstatic.net/y9DpT.jpg",
    //setting value to default if it is empty
        set: (v) => v === "" ? "https://i.sstatic.net/y9DpT.jpg" : v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;