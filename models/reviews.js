var mongoose = require("mongoose");
var passportLocalMongose = require("passport-local-mongoose");

var reviewSchema = new mongoose.Schema({
    movieID: String,
    content: String,
    user: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
        
    }
});

reviewSchema.plugin(passportLocalMongose);

module.exports = mongoose.model("Review", reviewSchema);