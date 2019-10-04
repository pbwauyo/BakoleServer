const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/Review');
const bodyParser = require('body-parser');
const url = require('../constants');

mongoose.connect(url, {useNewUrlParser: true}, (err)=>{
  if(err) console.log(err.message);
  else console.log("Connection to cloud db successful");
})

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.post('/', (req, res, next)=>{
    const review = new Review({
        _id : new mongoose.Types.ObjectId(),
        reviewerId : req.body.reviewerId,
        reviewMsg : req.body.reviewMsg,
        reviewedId : req.body.reviewedId
    });

    review.save()
          .then((doc)=>{
            res.status(200).json({message: "review saved successfully"})
          })
          .catch((err)=>{
            console.log(err);
            res.json({err: err})
          });
    
    res.status(201).json({
        message : "handling review post request"
    })
    
})

router.get('/', (req, res, next) => {
    const reviewId = req.body.reviewId;
    Review.find({reviewId: reviewId})
          .exec()
          .then((doc)=>{
            res.json(doc);
            console.log(doc);
          })
          .catch((err)=>{
            console.log(err);
            res.json({err: err})
          });
    
    res.json({
        message: "handling review get request"
    });
})

module.exports = router;