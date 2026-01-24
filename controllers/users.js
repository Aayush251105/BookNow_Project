// DB Models
const User = require("../models/user.js");

// render signup
module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
}

// signup route
module.exports.signup = async(req, res) => {
    try {
        let {username , email , password} = req.body;
        const newUser = new User({
            email,username,
        });
    
        const regUser = await User.register(newUser , password);
        console.log(regUser);
        req.login(regUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to BookNow!");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

// login render
module.exports.renderLogin = (req,res) => {
    res.render("users/login.ejs");
}

// login
module.exports.login = async(req,res) => {
    req.flash("success" , "Welcome back to BookNow!");
    // to make sure direct login returns to /listings
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

// logout
module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err){
            next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}