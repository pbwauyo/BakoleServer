const express = require('express');
const requestListener = express();
const usersRoute = require('./routes/users');
const reviewsRoute = require('./routes/review');
const jobPostsRoute = require('./routes/jobDescription');
const workersRoute = require('./routes/worker');
const employersRoute = require('./routes/employer');
const cors = require('cors');

const apiPrefix = '/api/v1'

//requestListener.use(cors);

//requestListener.use('/api/v1/users', usersRoute)

requestListener.use('/employers', employersRoute);

requestListener.use('/users', usersRoute);

requestListener.use('/jobs', jobPostsRoute);

requestListener.use('/workers', workersRoute);

requestListener.use((req, res, next)=>{
    const error = new Error("Not found")
    error.status = 404
    error.message = "No matching route"

    next(error);
})

requestListener.use((err, req, res, next)=>{
    res.status(err.status || 500).json({
        err: err.message
    })
})


requestListener.use(apiPrefix + '/reviews', reviewsRoute);

module.exports = requestListener;

