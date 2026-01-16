const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

// connect to db
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/booknow")
}
main()
.then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
})

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
};

initDB();