const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const url = require('../constants');
const Job = require('../models/jobDescription');

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
                res.status(200).send(doc);
            }
        });
        
    }catch(err){
        console.log(err.message);
    }

});

router.post('/:workerId', async (req, res, next)=>{

    var _id = req.params.workerId;
    var employerEmail = req.body.employerEmail;
    var description = req.body.description;
    var category = req.body.category;
    var fee = req.body.fee;
    var place = req.body.location;
    var time = req.body.startTime;

    if(employerEmail.trim()!="" && description.trim()!="" && category.trim()!="" && fee.trim()!="" && place.trim()!="" && time.trim()!=""){
        
        const job = new Job ({
            _id: _id,
            employerEmail: employerEmail,
            description: description,
            category: category,
            fee: fee,
            place: place,
            time: time
        });

        

        try{
            
            await job.save()
            res.status(200).json({msg: "job details saved successfully"});

        }catch(err){
            console.error(err.message);
            res.status(500).json({msg: "error while saving"});
        }    
        
        
    }
});

router.delete('/', (req, res, next)=>{

});

module.exports = router;
