var mongoose = require("mongoose");
var Note = require("./Note");

var Schema = mongoose.Schema;


var TrackSchema = new Schema({
    title: {
        type: String,
        // required: true
    },
    author: { 
        type: String,
        // required: true
    },
    link: {
        type: String,
        // required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

var Track = mongoose.model("Track", TrackSchema);

module.exports = Track;