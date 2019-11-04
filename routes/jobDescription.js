/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const url = require('../constants');
const Job = require('../models/jobDescription');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = "../key/bakole-a06db-firebase-adminsdk-wajyh-c38b702a13.json";

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

const firebaseDb= firebaseAdmin.firestore();

mongoose.connect(url, {useNewUrlParser:true}, (err)=>{
    if(err) console.log(err);
    else console.log("connection to cld db successful");
})

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/:workerId', async (req, res, next) => {
    const workerId = req.params.workerId;

    try{
        await Job.find({_id : workerId}).lean().exec((err, doc)=>{
            if(err){
                console.log(err);
            }
            if(doc){
                console.log(doc);
                res.status(200).send(doc);
            }
        });
        
    }catch(err){
        console.log(err.message);
    }

});

router.post('/:workerId', async (req, res, next)=>{

    var _id = req.params.workerId;
    var employerName = req.body.employerName;
    var employerEmail = req.body.employerEmail;
    var employerDeviceToken = req.body.employerDeviceToken;
    var description = req.body.description;
    var category = req.body.category;
    var fee = req.body.fee;
    var place = req.body.place;
    var time = req.body.time;
    var date = req.body.date;
    
    const job = new Job ({
        _id: _id,
        employerName: employerName,
        employerEmail: employerEmail,
        employerDeviceToken: employerDeviceToken,
        description: description,
        category: category,
        fee: fee,
        place: place,
        time: time,
        date: date, 
    });

    console.log(job);

    try{
        
        await job.save()
        let worker = {
            wEmail: employerEmail,
            wDeviceId: employerDeviceToken
        }

        await firebaseDb.collection("workers").doc(_id).set(worker);

        res.status(200).json({msg: "job details saved successfully"});

    }catch(err){
        console.error(err.message);
        res.status(500).json({msg: "error while saving"});
    }       
  }
);

router.delete('/', (req, res, next)=>{

});

module.exports = router;
