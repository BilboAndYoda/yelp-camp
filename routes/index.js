var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//=============
// INDEX
//=============
router.get("/", function(req, res) {
    res.render('landing');
});

//==============
// AUTH ROUTES
//==============

//signup form
router.get("/signup", function(req, res) {
    res.render("signup");
})

//signup logic
router.post("/signup", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("signup")
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Hello, " + user.username);
            res.redirect("/campgrounds");
        });
    });
})

//signin form
router.get("/signin", function(req, res) {
    res.render("signin");
})

//signin logic
router.post("/signin", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/signin"
    }),
    function(req, res) {})

//signout logic
router.get("/signout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully signed out.");
    res.redirect("/campgrounds");
});

module.exports = router;
