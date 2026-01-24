const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport")

const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");

// Controller
const userController = require("../controllers/users.js");

// router.route
// SIGN-UP
router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup))

// Login
router.route("/login")
.get(userController.renderLogin )
.post(saveRedirectUrl,
    passport.authenticate("local" , {failureRedirect: "/login" , failureFlash: true}) ,
    userController.login
)

// 3. Logout Route
router.get("/logout" , userController.logout)

// SIGN-UP
// // 1. get signup route
// router.get("/signup", userController.renderSignup);

// // 2. Post Signup route
// router.post("/signup", wrapAsync(userController.signup));

//LOGIN
// // 1. Get login route
// router.get("/login" , userController.renderLogin )

// // 2. Post Login Route
// // passport middleware
// router.post("/login",saveRedirectUrl,
//     passport.authenticate("local" , {failureRedirect: "/login" , failureFlash: true}) ,
//     userController.login)



module.exports = router;
