var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    request = require('request'),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds")


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
seedDB();



app.get("/", function(req, res) {
    res.render('landing');
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
    //get all campgounrounds from DB
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index', { campgrounds: campgrounds });
        }
    })

});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCamp = { name: name, image: image, description: desc };
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

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {

    res.render('new');
});

//SHOW - shows information about one campground

app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("show", { campground: foundCampground });
        }
    });
});




app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!!!");
});




//new, create, update, destroy, 

//REST - a mapping between HTTP routes and CRUD

// create
// read
// update
// destroy
