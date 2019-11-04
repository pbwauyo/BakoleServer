/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const url = require('../constants');
const Employer = require('../models/employer');

mongoose.connect(url, {useNewUrlParser: true}, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("connection success");
    }
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/:email/:password', async(req, res, next)=>{
    const email = req.params.email;
    const password = req.params.password;

    try{
        await Employer.find({email: email, password: password}).lean().exec((err, doc)=>{
            if(err){
                console.log(err);
                throw(err);
            }
            if(JSON.stringify(doc).length > 0){
                console.log(doc);
                res.status(200).send(doc);
            }
            else{
                res.status(500).json({message: "no such employer available"});
            }
        });
    }catch(err){
        console.log(err);
    }
});

router.post('', async(req, res, next)=>{
    const employer = new Employer({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        sex: req.body.sex,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        location: req.body.location,
        rating: req.body.rating,
        deviceToken: req.body.deviceToken
    });

    try{
        await employer.save().then((val)=>{
            console.log(val);
            res.status(200).json({message: "employer saved successfully"});
        }, (err=>{
            console.log(err);
            throw(err);
        }))
    }
    catch(err){
        console.log(err);
    }
    
});

module.exports = router;

