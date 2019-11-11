const mongoose = require('mongoose');

const employerJob = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    status : String,
    job : {
        employerName: String,
        employerEmail: String,
        deviceToken: String,
        description: String,
        category: String,
        fee: String,
        place: String,
        time: String,
        date: String
    }
});

module.exports = mongoose.model("employerjobs", employerJob);