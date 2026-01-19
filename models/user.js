const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true, 
    },
    // passport local mongoose will automatically save username and password automatically
})

// console.log(passportLocalMongoose)

// adds username password fields and different methods 
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , userSchema);
