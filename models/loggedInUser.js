const mongoose = require("mongoose");

const loggedInUser = mongoose.Schema({
    _id : String,
    user : [],
    userType : String
});

module.exports = mongoose.model('loggedinusers', loggedInUser)