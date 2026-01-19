const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport")

const User = require("../models/user.js");

// SIGN-UP
// 1. get signup route
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// 2. Post Signup route
router.post("/signup", wrapAsync(async(req, res) => {
    try {
        let {username , email , password} = req.body;
        const newUser = new User({
            email,username,
        });
    
        const regUser = await User.register(newUser , password);
        console.log(regUser);
        req.flash("success" , "Welcome to BookNow!");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

//LOGIN
// 1. Get login route
router.get("/login" , (req,res) => {
    res.render("users/login.ejs");
})

// 2. Post Login Route
// passport middleware
router.post("/login",passport.authenticate("local" , {failureRedirect: "/login" , failureFlash: true}) ,async(req,res) => {
    req.flash("success" , "Welcome back to BookNow!");
    res.redirect("/listings");
})

module.exports = router;
