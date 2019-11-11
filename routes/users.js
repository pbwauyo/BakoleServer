/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
const bodyParser = require('body-parser');
const Worker = require('../models/workerDetails');
const Employer = require('../models/employer');
const session  = require('express-session');
const MemoryStore = require('memorystore')(session)
const LoggedInUser = require('../models/loggedInUser');

const cloudDbUrl = 'mongodb+srv://pbwauyo:platinum87@cluster0-5gns4.mongodb.net/test?retryWrites=true&w=majority';
const WORKER = "worker";
const EMPLOYER = "employer";

mongoose.connect(cloudDbUrl, {useNewUrlParser: true}, (err)=>{
    if(err) console.log(err.message);
    else console.log("connection to cloud db succesful");
    
})

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
router.use(session({secret: "mkjnk", saveUninitialized: true, resave: true, 
    store: new MemoryStore({
        checkPeriod: 86400000 ,
    }),
    expires: new Date(Date.now() + (30 * 86400 * 1000)), 
    
})
)


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

/*
    this route is for removing the logged in phone from the database when a user
    logs out from the app
*/
router.delete('/:phoneId', async (req, res, next)=>{
    const phoneId = req.params.phoneId;
    await LoggedInUser.deleteMany({_id : phoneId}, (err)=>{
        if(err){
            console.log(err);
            res.status(400).json({error : "error while deleting document"});
        }
        else{
            res.status(200).json({message : "document deleted successfully"});
        }
    });
});

/* this route is for checking whether a particular email is logged in via the phone which 
matches the phoneId param */
router.get('/:phoneId', async(req, res, next)=>{
    const phoneId = req.params.phoneId;
    console.log("connection made in user/id");

    try {
        await LoggedInUser.find({_id : phoneId}).lean().exec((err, doc) => {
            if(err){
                console.log("error", err);
                //res.status(404).json({"error": "error has occured. check log"});
                throw(error);     
            }
            else if(doc && JSON.stringify(doc).length>2){
                console.log(doc);
                if(doc[0]["userType"] == WORKER){
                    res.set("user-type", WORKER);
                    console.log(doc[0]["userType"] , doc[0]["user"])
                    res.status(200).send(doc[0]["user"]);
                }
                else if(doc[0]["userType"] == EMPLOYER){
                    res.set('user-type', EMPLOYER);
                    console.log(doc[0]["userType"] , doc[0]["user"])
                    res.status(200).send(doc[0]["user"]);
                }
                else{
                    res.status(404).json({error: "invalid user type"});
                }
            }
            else{
                res.status(404).json({message: "no logged in users"});
            }
        });
    } catch (error) {
        res.status(404).json({"error": "error has occured. check log"});
    }
    
});

/*this will handle storing a user's deviceToken everytime they login from the app
    The token will be used for firebase push notifications to that particular device*/
router.patch('/:deviceToken/:email/:userType', async (req, res, next)=>{
    const deviceToken = req.params.deviceToken;
    const email = req.params.email;
    const userType = req.params.userType;

    console.log(deviceToken , email , userType);

    if(userType == WORKER){

        try{
            await Worker.update({email : email}, {$set: {deviceToken : deviceToken}},{multi: true}, (err, raw)=>{
                if(err){
                    res.status(404).json({error: "error occured while saving token"});
                    throw(err)
                }
                else{
                    res.status(200).json({message: "device token saved successfully"});
                }
            });
        }catch(err){
            console.log(err);
        }
    }
    else if(userType == EMPLOYER){
        try{
            await Employer.update({email : email}, {$set: {deviceToken : deviceToken}}, {multi: true}, (err, raw)=>{
                if(err){
                    res.status(400).json({error: "error occured while saving token"});
                    throw(err)
                }
                else{
                    res.status(200).json({message: "device token saved successfully"});
                }
            });
        }catch(err){
            console.log(err);
            res.status(404).json({error: "error occured"});
        }
    }
    else{
        res.status(404).json({message: "user type in invalid"});
    }

});


/*The phoneId param will be stored here for later usage when checking whether 
there's a logged in user attached to it */

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

                const loggedInUser = new LoggedInUser({
                    _id : phoneId,
                    user : docs,
                    userType : WORKER,
                });
                
                try {
                    await loggedInUser.save();
                } catch (error) {
                    console.log(error);
                }
                
                res.status(200).send(docs);
            }
            else{
                console.log("not found in worker");
                console.log(email, password);
                await Employer.find({email:email, password:password}, '-__v').lean().exec(async(err, doc)=>{
                    if(err){
                        console.log(err);
                        throw(err)
                    }
                    console.log(doc);
                    if(JSON.stringify(doc).length > 2){
                        res.set('user-type', 'employer');
           
                        const loggedInUser = new LoggedInUser({
                            _id : phoneId,
                            user : doc,
                            userType : EMPLOYER,
                        });
                        
                        try {
                            await loggedInUser.save();
                        } catch (error) {
                            console.log(error);
                        }

                        res.status(200).send(doc);    
                    }
                    else{
                        res.status(404).json({message: "no user found"});
                    }

                });
            }    // req.session.destroy((err)=>{
                //     if(err){
                //         console.log(err);
                //         res.status(400).json({"error" : "failed to clear session"})
                //     }
                //     else{
                //         res.status(200).json({"message": "session cleared succesfully"})
                //     }
                // })
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