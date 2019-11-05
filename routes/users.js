/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
const bodyParser = require('body-parser');
const Worker = require('../models/workerDetails');
const Employer = require('../models/employer');
const session  = require('express-session');

const cloudDbUrl = 'mongodb+srv://pbwauyo:platinum87@cluster0-5gns4.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(cloudDbUrl, {useNewUrlParser: true}, (err)=>{
    if(err) console.log(err.message);
    else console.log("connection to cloud db succesful");
    
})

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
router.use(session({secret: "mkjnk", saveUninitialized: false, resave: false}))

router.get('', (req, res, next)=>{
    // req.session.destroy((err)=>{
    //     if(err){
    //         console.log(err);
    //         res.status(400).json({"error" : "failed to clear session"})
    //     }
    //     else{
    //         res.status(200).json({"message": "session cleared succesfully"})
    //     }
    // })

    res.status(200).json({"message" : "Connection successful"});
})

router.get('/:phoneId', async(req, res, next)=>{
    const phoneId = req.params.phoneId;

    if(req.session.loggedInUsers){
        const loggedInUsers = req.session.loggedInUsers;
        var exists = false;
        var user;
        console.log("Logged in users: ", loggedInUsers);

        for(loggedInUser of loggedInUsers){
            if(loggedInUser.phoneId == phoneId){
                user = loggedInUser.user;
                console.log("user exists: ", user);
                exists = true;
            }
        }
        console.log(exists);

        if(exists){
            res.status(200).send(user);
        }else{
            res.status(404).json({"message": "no matching record for user"});
        }
        
    }
    else{
        console.log("No logged in user");
        res.status(404).json({"message": "no logged in user"});
    }
});

router.get('/:phoneId/:email/:password', async (req, res, next) => {
    const email = req.params.email;
    const password = req.params.password;
    const phoneId = req.params.phoneId;

    console.log(email);
    console.log(password);

    try{
        
        await Worker.find({email:email, password:password}, '-__v').lean().exec(async (err,docs)=>{
            if(err){
                console.log(err.message);
                throw(err);
            }
            
            if(JSON.stringify(docs).length>2){
                res.set('user-type', 'worker');

                if(!req.session.loggedInUsers){
                    req.session.loggedInUsers = [];
                    req.session.loggedInUsers.push({
                        phoneId: phoneId,
                        user: docs
                    });
                }
                else{
                    req.session.loggedInUsers.push({
                        phoneId: phoneId,
                        user: docs
                    });
                }

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
                        res.set('user-type', 'employer');
                        if(!req.session.loggedInUsers){
                            req.session.loggedInUsers = [];
                            req.session.loggedInUsers.push({
                                phoneId: phoneId,
                                user: doc
                            });
                        }
                        else{
                            req.session.loggedInUsers.push({
                                phoneId: phoneId,
                                user: doc
                            });
                        }
                        res.status(200).send(doc);    
                    }
                    else{
                        res.status(404).json({message: "no user found"});
                    }

                });
            }
        });
        
    }catch(err){
        console.log(err);
    }
    
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

})

module.exports = router