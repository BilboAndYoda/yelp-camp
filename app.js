var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require('request');

var campgrounds = [
    { name: "Yosemite", image: "pic" },
    { name: "Big Sur", image: "pic" },
    { name: "Hume Lake", image: "pic" },
    { name: "Yellowstone", image: "pic" }
];


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render('index');
});

app.get("/campgrounds", function(req, res) {
    res.render('campgrounds', { campgrounds, campgrounds });
});










app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!!!");
});
