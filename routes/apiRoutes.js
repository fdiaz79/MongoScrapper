var Note = require("../models/Note.js");
var Track = require("../models/Track.js");


var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {
    
    app.get("/scrape", function (req, res) {
        // grab the body with axios
        
        axios.get("https://bandcamp.com").then(function (response) {
            // save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            
            
            // console.log($.html());
            
            $("div.discover-item").each(function (i, element) {

                // console.log(i, element);

                console.log("scraping");
                console.log($(this).children("a.item-title"));
                
                var result = {};

                result.title = $(this).find("a.item-title").text();
                result.author = $(this).children("a.item-artist").text();
                result.link = $(this).children("a.item-title").attr("href");

                // console.log("here is title", result.title);

               
                var entry = new Track(result);

                // Save entry to the db
                entry.save(function (err, doc) {
                    if (err) {
                        console.log(err);
                    }else {
                        console.log(doc);
                    }
                });
            });
            
            res.send("Scrape Complete");

        });
    });

    // Get tracks from mongoDB
    app.get("/tracks", function (req, res) {
        
        Track.find({}, function (error, doc) {            
            if (error) {
                console.log(error);
            } else {
                res.json(doc);
            }
        });
    });

    // Grab an track by it's ObjectId
    app.get("/tracks/:id", function (req, res) {
        
        Track.findOne({ "_id": req.params.id })
        // populate all of the notes of the track
        .populate("note").exec(function (error, doc) {               
            if (error) {
                console.log(error);
            }else {
                res.json(doc);
            }
        });
    });


    // Save an track
    app.post("/tracks/save/:id", function (req, res) {
        // Update saved status
        Track.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }else {
                res.send(doc);
            }
        });
    });

    // Delete an track
    app.post("/tracks/delete/:id", function (req, res) {
        Track.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }else {
                res.send(doc);
            }
        });
    });


    // Create a new note
    app.post("/notes/save/:id", function (req, res) {
        // Pass the req.body to the entry
        var newNote = new Note({
            body: req.body.text,
            track: req.params.id
        });
        // console.log(req.body)
        newNote.save(function (error, note) {
            if (error) {
                console.log(error);
            }else {
                // Use the track id to find and update it's notes
                Track.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": note } })
                    .exec(function (err) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }else {
                            res.send(note);
                        }
                    });
            }
        });
    });

    // Delete a note
    app.delete("/notes/delete/:note_id/:track_id", function (req, res) {
        Note.findOneAndRemove({ "_id": req.params.note_id }, function (err) {
            if (err) {
                console.log(err);
                res.send(err);
            }else {
                Track.findOneAndUpdate({ "_id": req.params.track_id }, { $pull: { "notes": req.params.note_id } })
                    .exec(function (err) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }else {
                            res.send("Note Deleted");
                        }
                    });
            }
        });
    });
}