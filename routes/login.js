/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const SignUp = require('../models/workerDetails');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = require('../constants');
const express = require('express');
const router = express.Router();

mongoose.connect(url, (err)=>{
    if(err) console.log(err.message);
    else console.log("Database connection successful");
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', (req, res, next)=>{
    email = req.body.email;
    password = req.body.password;

    SignUp.find({email: email, password: password})
          .exec()
          .then((doc)=>{
            if(doc.length >= 1){
                res.status(200).json({message: "user exists"});
            }
          })
          .catch((err)=>{
               res.status(500).json({err: err}); 
          });

    res.status(201).json({message: "handling request"});
});

module.exports = router;