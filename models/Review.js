const mongoose = require('mongoose');

const review = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    reviewerId : String,
    reviewMsg : String,
    reviewedId : String
})

module.exports = mongoose.model('Review', review);