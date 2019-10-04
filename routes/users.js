const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
const bodyParser = require('body-parser');
const Worker = require('../models/workerDetails');
const Employer = require('../models/employer');

const cloudDbUrl = 'mongodb+srv://pbwauyo:platinum87@cluster0-5gns4.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(cloudDbUrl, {useNewUrlParser: true}, (err)=>{
    if(err) console.log(err.message);
    else console.log("connection to cloud db succesful");
    
})

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/:email/:password', async (req, res, next) => {
    const email = req.params.email;
    const password = req.params.password;
    var test = "initial";
    console.log(email);
    console.log(password);

    try{
        await Worker.find({email:email, password:password}, '-__v').lean().exec(async (err,docs)=>{
            if(err){
                console.log(err.message);
                throw(err);
            }
            
            if(JSON.stringify(docs).length>2){
                console.log("greater than 0");
                console.log(JSON.stringify(docs).length);
                console.log(docs);
                test = "user found in workers";
                res.set('user-type', 'worker');
                res.status(200).send(docs);           
            }
            else{
                console.log("not found in worker");
                console.log(email, password);
                await Employer.find({email:email, password:password}, '-__v').lean().exec((err, doc)=>{
                    if(err){
                        console.log(err);
                        throw(err)
                    }
                    console.log(doc);
                    if(JSON.stringify(doc).length > 2){
                        test = "user found in employers";
                        res.set('user-type', 'employer');
                        res.status(200).send(doc);    
                             
                    }
                    else{
                        res.status(404).json({message: "no user found"});
                    }

                });
            }
        });
        

        //console.log(test);
    }catch(err){
        console.log(err);
        throw(err);
    }finally{
        //console.log(test);
    }
    //console.log(test);
    
    
});

router.post('/', (req, res, next)=>{
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        sex: req.body.sex,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
    });

    
    user.save()
        .then((doc)=>{
            console.log(doc);
        })
        .catch((err)=>{
            console.log(err);
        })

    res.status(200).json({message: ""});    

    // res.status(201).json({
    //     message: "handling request",
    //     user: user
    // })
})

// router.get('/', (req, res, next)=>{
//     User.find().exec().then((doc)=>{
//         console.log(doc);
//         res.status(200).json(doc);
//     })
// }
// )

router.get('/', (req, res, next)=>{
    res.status(200).json({message: "connection ok"});
    console.log("connection has been made at Users");
}
);

module.exports = router