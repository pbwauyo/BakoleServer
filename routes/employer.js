/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const url = require('../constants');
const Employer = require('../models/employer');
const EmployerJob = require('../models/employerJob');
const Job = require('../models/jobDescription');

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

router.post('/jobs', async (req, res, next)=>{
    const _id = mongoose.Types.ObjectId();
    const status = req.body.status;
    const job = {
        jobId: req.body.job.jobId,
        employerName: req.body.job.employerName,
        employerEmail: req.body.job.employerEmail,
        description: req.body.job.description,
        category: req.body.job.category,
        fee: req.body.job.fee,
        place: req.body.job.place,
        time: req.body.job.time,
        date: req.body.job.date
    };

    console.log(job);

    const employerJob = EmployerJob({
        _id : _id,
        status : status,
        job : job
    });

    try {
        await employerJob.save().then((val)=>{
            console.log(val);
            res.status(200).json({message : "job saved successfully"});
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({error : "error while saving job"});
    }

});

router.get('/jobs/find/:jobId', async (req, res, next)=>{
    const jobId = req.params.jobId;
    console.log("jobId " ,jobId);

    try {
        await Job.find({jobId : jobId}).lean().exec((err, doc)=>{
            if(err){
                console.log("err has occured", err);
                res.status(404).json({error : "error while finding job"});
            }
            else if(doc){
                console.log(doc);
                res.status(200).send(doc);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({error : "error while finding job"});
    }
   
});

router.patch('/jobs/:email', async (req, res, next)=>{
    const email = req.params.email;

    //first set the number of workers who have accepted the job
     try {  
       await EmployerJob.find({"job.employerEmail" : email}).lean().exec(async (err, results)=>{
            if(err){
                console.log(err);
                res.status(404).json({error: "no matching records"});
            }
            else if(results){
                for(result of results){
                    const jobId = result["job"]["jobId"];
                    console.log("jobId: ", jobId);

                    //first find the number of workers who have accepted to do the job
                    try{
                        await Job.find({jobId: jobId, status : "Accepted"}).lean().exec(async (err, docs)=>{
                            if(err){
                                console.log(err);
                            }
                            else if(docs){
                                var size = docs.length;
                                console.log("docs: ", docs, "length: ", size);
                                await EmployerJob.update({"job.employerEmail" : email, "job.jobId" : jobId},{$set : {numOfWorkers : size.toString(), status: "Active"}}, {multi: true}, (err, raw)=>{
                                    if(err){
                                        console.log(err);
                                    }
                                });
                            }
                        })
                    }catch(err){
                        console.log(err);
                        res.status(404).json({error: "no jobs"});
                    }
                }
                res.status(200).json({message: "success"});
            }
        });
    }catch(error){
        console.log(error);
        res.status(404).json({error: "error occured"});
    }
});

/*
    Retrieve all jobs which match the employer's email
*/
router.get('/jobs/:email', async (req, res, next)=>{

    try {
        const email = req.params.email;

        await EmployerJob.find({"job.employerEmail" : email}).lean().exec((err, doc)=>{
            if(err){
                console.log(err);
                res.status(404).json({error : "error has occured"});
            }
            else if (doc){
                console.log("found jobs ", doc);
                res.status(200).send(doc);
            }
            else{
                res.status(500).json({error : "unknown error has occured"});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({error: "error while retrieving jobs"});
    }
});

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

