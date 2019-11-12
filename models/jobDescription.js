const mongoose = require('mongoose');

const jobDescription = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    jobId : String,
    workerId : String,
    employerName: String,
    employerEmail: String,
    deviceToken: String,
    description: String,
    category: String,
    fee: String,
    place: String,
    time: String,
    date: String
});

module.exports = mongoose.model('JobDescription', jobDescription);