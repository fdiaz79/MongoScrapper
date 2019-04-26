var Note = require("../models/Note.js");
var Track = require("../models/Track.js");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {
    //GET requests to render Handlebars pages
    app.get("/", function (req, res) {
        Track.find({ "saved": false }, function (error, data) {
            var trackObject = {
                track: data
            };
            // console.log(trackObject);
            res.render("home", trackObject);
        });
    });

    app.get("/saved", function (req, res) {
        Track.find({ "saved": true }).populate("notes").exec(function (error, tracks) {
            var trackObject = {
                track: tracks
            };
            res.render("saved", trackObject);
        });
    });
}