var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require('request');

var campgrounds = [
    { name: "Yosemite", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1050&q=80" },
    { name: "Big Sur", image: "https://images.unsplash.com/photo-1503276119451-51ac0fdc4668?auto=format&fit=crop&w=1050&q=80" },
    { name: "Hume Lake", image: "https://images.unsplash.com/photo-1500046908247-f52924592df4?auto=format&fit=crop&w=967&q=80" },
    { name: "Yellowstone", image: "https://images.unsplash.com/photo-1507760754559-9bb621edc403?auto=format&fit=crop&w=968&q=80" }
];


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render('index');
});

app.get("/campgrounds", function(req, res) {
    res.render('campgrounds', { campgrounds: campgrounds });
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCamp = { name: name, image: image };
    campgrounds.push(newCamp);

    res.redirect('/campgrounds');
});

app.get("/campgrounds/new", function(req, res) {

    res.render('new.ejs');
});








app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!!!");
});
