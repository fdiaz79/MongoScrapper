var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {
    //GET requests to render Handlebars pages
    app.get("/", function (req, res) {
        Article.find({ "saved": false }, function (error, data) {
            var hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("home", hbsObject);
        });
    });

    app.get("/saved", function (req, res) {
        Article.find({ "saved": true }).populate("notes").exec(function (error, articles) {
            var hbsObject = {
                article: articles
            };
            res.render("saved", hbsObject);
        });
    });
}