/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = require('../constants');
const SignUp = require('../models/workerDetails');

mongoose.connect(url, (err)=>{
    if(err) console.log(err);
    else console.log("connection to cloud db successful");
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.post('/', (req, res, next)=>{
    const signUp = new SignUp({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    });

    signUp.save()
          .then((doc)=>{
            res.status(200).json(doc);
          })
          .catch((err)=>{
            res.status(500).json({err : err});
            console.log(err);
          });
          
    res.status(201).json({message: "handling request"});      
});

router.get('/', (req, res, next)=>{
    //validate new users before saving
});

router.delete();

router.patch()

module.exports = router;

