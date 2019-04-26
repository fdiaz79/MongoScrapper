var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    body: {
        type: String
    },
    track: {
        type: Schema.Types.ObjectId,
        ref: "Track"
    }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;