var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", function(req, res) {
    //get all campgrounds from DB
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('campgrounds/index', { campgrounds: campgrounds });
        }
    })

});

//NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

//CREATE - add new campground to DB
router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var author = { id: req.user._id, username: req.user.username };
    var desc = req.body.description;
    var newCamp = {
        name: name,
        image: image,
        author: author,
        description: desc
    };
    //create new campground and save to database
    Campground.create(newCamp, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/campgrounds');
        }
    });
});

//SHOW - shows information about one campground
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/signin");
}

module.exports = router;
