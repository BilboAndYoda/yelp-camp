var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    request = require('request'),
    mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//         name: "Big Sur",
//         image: "https://images.unsplash.com/photo-1503276119451-51ac0fdc4668?auto=format&fit=crop&w=1050&q=80"
//     },
//     function(err, campground) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.log("NEWLY CREATED CAMPGROUND: ");
//             console.log(campground);
//         }
//     });


app.get("/", function(req, res) {
    res.render('index');
});

app.get("/campgrounds", function(req, res) {
    //get all campgounrounds from DB
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('campgrounds', { campgrounds: campgrounds });
        }
    })

});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCamp = { name: name, image: image };
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

app.get("/campgrounds/new", function(req, res) {

    res.render('new.ejs');
});








app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!!!");
});
