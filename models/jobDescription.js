const mongoose = require('mongoose');

const jobDescription = mongoose.Schema({
    _id: String,
    employerEmail: String,
    description: String,
    category: String,
    fee: String,
    place: String,
    time: String
});

module.exports = mongoose.model('JobDescription', jobDescription);