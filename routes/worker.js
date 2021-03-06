/* eslint-disable no-unused-vars */
const  Worker = require('../models/workerDetails');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const url = require('../constants');

mongoose.connect(url, {useNewUrlParser: true}, (err)=>{
    if(err)
    console.error(err);
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/:location', async (req, res, next)=>{
    console.log("connection has been made at Workers");
    //const formattedLocation = 
   
    try{
        await Worker.find({location: req.params.location}, 'firstName lastName sex category phoneNumber email averagePay location skillStatus rating').lean().exec((err, docs)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log(docs);
                res.status(200).send(docs);
            }
        });
        
    }catch(e){
        res.status(404);
        console.error(e);
    }
});

/*
    Get Worker
*/

router.get('/search/:email', async (req, res, next)=>{
    const email = req.params.email;

    try{
        await Worker.find({email: email}).lean().exec((err, doc)=>{
            if(err){
                console.log(err);
                res.status(500).json({"ERROR WHILE RETRIEVING" : err});
            }
            else if(JSON.stringify(doc).length > 0){
                console.log(doc);
                res.status(200).send(doc);
            }
            else{
                console.log("NO SUCH WORKER");
                res.status(404).json({message: "no such worker available"});
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({"INTERNAL ERROR" : err});
    }
});

/*
    Get worker details with the specified id param
*/
router.get('/ids/:workerId', async(req, res, next)=>{
    const id = req.params.workerId;

    try{
        await Worker.find({_id:id}, 'firstName lastName sex category phoneNumber email averagePay location skillStatus rating').lean().exec((err, doc)=>{
            if(err){
                throw(err);
            }
            else{
                
                console.log(doc);
                res.status(200).send(doc); 
            }
        })
    }catch(err){
        console.log(err);
    }   
});

router.post('/', async(req, res, next)=>{
    const worker = new Worker({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        sex: req.body.sex,
        category: req.body.category,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        averagePay: req.body.averagePay,
        location: req.body.location,
        skillStatus: req.body.skillStatus,
        rating: req.body.rating,
        deviceToken: req.body.deviceToken
    });

    console.log("executing worker post request");
    try{
        console.log("try block start");
        console.log(worker);
        await worker.save().catch((err)=>{
            console.log(err);
        });
        
        res.status(200).json({msg: "success"});
        console.log("try block end");
    }catch(error){
        res.status(500);
        console.log(error);
    }
})

module.exports = router;

