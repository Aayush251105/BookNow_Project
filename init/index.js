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
    // adding owner - Aayush
    initdata.data = initdata.data.map((obj) => ({...obj , owner: '696cd8fefb96e1fa09a11310'}))
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
};

initDB();