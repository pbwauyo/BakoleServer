/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const url = require('../constants');
const Job = require('../models/jobDescription');
const Worker = require("../models/workerDetails");
const Employer = require("../models/employer");
const firebaseAdmin = require('firebase-admin');
const serviceAccount = "/home/pbwauyo/service account/bakole-a06db-firebase-adminsdk-wajyh-c38b702a13.json";

const WORKER = "worker";
const EMPLOYER = "employer";

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

const firebaseDb= firebaseAdmin.firestore();

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology: true}, (err)=>{
    if(err) console.log(err);
    else console.log("connection to cld db successful");
})

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

/*
    Route for retrieving specific job
*/

router.get('/retrieve/:id', async (req, res, next)=>{
    console.log("retrieving jobs");
    const id = req.params.id;

    try {
        await Job.find({_id : id}).lean().exec((err,docs)=>{
            if(err){
                console.log("ERROR: ", err);
                res.status(404).json({error: "Job not found"});
            }
            else{
                console.log("FOUND JOB: ", docs);
                res.status(200).send(docs);
            }
        });
    } catch (error) {
        console.log("ERROR WHILE RETRIEVING JOB ", error);
        res.status(500).json({error: "Internal error"});
    }

});

/*
    Route for declining jobs using _id field to look it up
*/
router.post('/decline/:id', async (req, res, next)=>{
    const id = req.params.id;

    try {
        await Job.update({_id : id}, {$set : {status : "Declined"}}, {multi: true},(err, raw)=>{
            if(err){
                console.log(err);
                res.status(404).json({error : "error during declining job"});
            }
            else {
                console.log("declination success");
                res.status(200).json({message : "declination success"});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({error : "error during declining"});
    }
});

/*
    Route for accepting jobs using _id field to look it up
*/
router.post('/accept/:id', async (req, res, next)=>{
    const id = req.params.id;

    try {
        await Job.update({_id : id}, {$set : {status : "Accepted"}}, {multi: true},(err, raw)=>{
            if(err){
                console.log(err);
                res.status(404).json({error : "error during accepting job"});
            }
            else {
                console.log("accept success");
                res.status(200).json({message : "accept success"});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({error : "error during accept"});
    }
});

/*
    This route will handle setting of the job progress to Started
*/

router.patch('/progress/:id/:progress', async (req, res, next)=>{

    const id = req.params.id;
    const progress = req.params.progress;
    console.log("Progress: ", progress);

    try {
        await Job.update({_id: id}, {$set: {progress: progress}}, {multi: true}, (err, raw)=>{
            if(err){
                print(err);
                throw err;
            }
            else{
                res.status(200).json({message: "update successful"});
            }
        }); 
    } catch (error) {
        res.status(404).json({error: "failed to update"});
    }
    
});


/*
    This route enables workers to retrieve jobs which are currently posted to them
*/
router.get('/:workerId', async (req, res, next) => {
    const workerId = req.params.workerId;

    try{
        await Job.find({workerId : workerId}).lean().exec((err, doc)=>{
            if(err){
                console.log(err);
                res.status(404).json({"ERROR": err});
            }
            if(doc){
                console.log(doc);
                res.status(200).send(doc);
            }
        });
        
    }catch(err){
        console.log(err.message);
        res.status(500).json({"INTERNAL ERROR": err});
    }

});


/*
    This route handles posting of jobs to different workers
*/
router.post('', async (req, res, next)=>{

    var _id = mongoose.Types.ObjectId();
    var jobId = req.body.jobId;
    var workerId = req.body.workerId;
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
        jobId : jobId,
        workerId : workerId,
        employerName: employerName,
        employerEmail: employerEmail,
        employerDeviceToken: employerDeviceToken,
        description: description,
        category: category,
        fee: fee,
        place: place,
        time: time,
        date: date,
        status: "",
        progress: "Not Started" 
    });

    console.log(job);

    try{
        //save job to mongodb
        await job.save()

        /*  retrieve worker whose id is specified in the request so that he can looked up 
            in the db and get details about his email and deviceToken to be 
            used in sending a notification via firebase
        */
        await Worker.find({_id: workerId}).lean().exec(async (err, doc)=>{
            if(err){
                console.log("error in sending notif to worker: ", err);
            }
            if(doc){
                console.log("document: ", doc);

                let worker = {
                    wEmail: doc[0]["email"],
                    wDeviceId: doc[0]["deviceToken"]
                }
        
                await firebaseDb.collection("workers").doc(workerId).set(worker);

            }
        }) 

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
