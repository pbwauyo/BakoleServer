const mongoose = require('mongoose');

const employer = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    sex: String,
    phoneNumber: String,
    email: String,
    password: String,
    location: String,
    rating: String
    
});

module.exports = mongoose.model("Employer", employer);