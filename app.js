var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    request = require('request'),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
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

    res.render('campgrounds/new');
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
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});


app.get("/campgrounds/:id/comments/new", function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campground: campground });
        }
    })

})

app.post("/campgrounds/:id/comments", function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                }
                else {
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!!!");
});




//new, create, update, destroy, 

//REST - a mapping between HTTP routes and CRUD

// create
// read
// update
// destroy
