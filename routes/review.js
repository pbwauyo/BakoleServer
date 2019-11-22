/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/Review');
const bodyParser = require('body-parser');
const url = require('../constants');
const dateFormat = require('dateformat');

mongoose.connect(url, {useNewUrlParser: true}, (err)=>{
  if(err) console.log(err.message);
  else console.log("Connection to cloud db successful");
})

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.post('', async (req, res, next)=>{
    const review = new Review({
        _id : new mongoose.Types.ObjectId(),
        reviewerEmail : req.body.reviewerEmail,
        revieweeEmail : req.body.revieweeEmail,
        message : req.body.message,
        rating : req.body.rating,
        date: dateFormat(new Date(), "dd/mm/yyyy")
    });

    console.log(review);

    try{
      await review.save()
            .then((doc)=>{
              console.log("Document", doc);
              res.status(200).json({message: "review saved successfully"})
            })
            .catch((err)=>{
              console.log(err);
              res.status(404).json({"REVIEW SAVE ERROR": err})
            });
    }catch(err){
      console.log(err);
      res.status(500).json({"INTERNAL ERROR": err})
    }
    
})

router.get('/:email', async (req, res, next) => {
  const email = req.params.email;

  try {
    await Review.find({revieweeEmail : email}).lean().exec((err, docs)=>{
      if(err){
        console.log("ERROR IN RETRIEVAL: ", err);
        res.status(404).json({ERROR: error});
      }
      else{
        console.log("DOC: ", docs);
        res.status(200).send(docs);
      }
    })

  } catch (error) {
    console.log("INTERNAL ERROR: ", error);
    res.status(500).json({ERROR: error});
  }
})

module.exports = router;