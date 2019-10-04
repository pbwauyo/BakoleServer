const mongoose = require('mongoose');

const worker = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    sex: String,
    category: String,
    phoneNumber: String,
    email: String,
    password: String,
    averagePay: String,
    location: String,
    skillStatus: String,
    rating: String,
})

module.exports = mongoose.model('Worker', worker);