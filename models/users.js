const mongoose = require('mongoose');

const userschema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    sex: String,
    email: String,
    phoneNumber: String,
    password: String
});

module.exports = mongoose.model("User", userschema);