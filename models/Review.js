const mongoose = require('mongoose');

const review = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    reviewerEmail : String,
    revieweeEmail : String,
    message : String,
    rating : String,
    date : String
})

module.exports = mongoose.model('reviews', review);