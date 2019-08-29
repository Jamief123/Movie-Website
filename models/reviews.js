var mongoose = require("mongoose");
var passportLocalMongose = require("passport-local-mongoose");

var reviewSchema = new mongoose.Schema({
    movieID: String,
    content: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

reviewSchema.plugin(passportLocalMongose);

module.exports = mongoose.model("Review", userSchema);