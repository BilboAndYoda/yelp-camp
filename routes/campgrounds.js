var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require("geocoder");

//INDEX - show all campgrounds
router.get("/", function(req, res) {
    //get all campgrounds from DB
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('campgrounds/index', { campgrounds: campgrounds, page: 'campgrounds' });
        }
    })

});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var author = { id: req.user._id, username: req.user.username };
    var desc = req.body.description;
    geocoder.geocode(req.body.location, function(err, data) {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCamp = {
            name: name,
            price: price,
            image: image,
            author: author,
            location: location,
            lat: lat,
            lng: lng,
            description: desc
        };
        //create new campground and save to database
        Campground.create(newCamp, function(err, newlyCreated) {
            if (err) {
                req.flash("error", "Could not create campground.")
                console.log(err);
            }
            else {
                res.redirect('/campgrounds');
            }
        });
    });
});

//SHOW - shows information about one campground
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found.");
            res.redirect("back");
        }
        else {
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    geocoder.geocode(req.body.location, function(err, data) {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {
            name: req.body.name,
            price: req.body.price,
            image: req.body.price,
            author: req.body.author,
            location: location,
            lat: lat,
            lng: lng,
            description: req.body.description
        };
        //create new campground and save to database
        Campground.findByIdAndUpdate(req.params.id, { $set: newData }, function(err, updatedCampground) {
            if (err) {
                req.flash("error", "Could not update campground.")
                console.log(err);
            }
            else {
                req.flash("success", "Successfully updated campground.");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
})

//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        req.flash("success", "Successfully deleted campground.");
        res.redirect("/campgrounds");
    })
})

module.exports = router;
