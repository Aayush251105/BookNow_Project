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
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
});

// handelling delete list - post mongoose middlewre
const Review = require("./reviews.js");

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;