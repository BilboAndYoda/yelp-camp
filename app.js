var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require('request');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.send("This is the home page.");
});




















app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!!!");
});
