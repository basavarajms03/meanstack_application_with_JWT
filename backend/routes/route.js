//Import express router to craete routers
const express = require('express');
const router = express.Router();

//import JSONWebtoken
const jwt = require('jsonwebtoken');

//Import database models
const registerModel = require('../models/register.model');
const countryModel = require('../models/country.model');
const stateModel = require('../models/state.model');
const districtModel = require('../models/district.model');

//JWT Authentication verification
const verify = require('./verify_authentication');

router.post('/register', (req, res) => {
    const newRegister = new registerModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    newRegister.save(newRegister, (err, response) => {
        if (err) {
            res.json({
                msg: 'You are getting error please check',
                error: err
            })
        } else {
            res.json({
                msg: 'You are registered successfuly',
                data: response
            });
        }
    })
});


router.post('/login', (req, res) => {

    email = req.body.email;
    password = req.body.password;

    registerModel.find({ email: email, password: password }, (err, response) => {
        if (err) {
            res.json({
                msg: 'You are getting error please check',
                error: err
            })
        } else {
            if (response.length === 0) {
                res.json({
                    msg: 'Sorry username or password does not exist',
                    isLoggedIn: false
                });
            } else {
                // //Create and assign a new token
                const token = jwt.sign({ _id: response[0]._id }, TOKEN_SECRET = "Amazecodes");
                res.header('Auth-Token', token);

                res.json({
                    msg: 'Successfully logged in',
                    isLoggedIn: true,
                    data: response,
                    token: token
                });
            }
        }
    });
});


//Add Countries
router.post('/addCountries', verify, (req, res) => {
    const newCountry = new countryModel({
        countryName: req.body.countryName.toUpperCase()
    });

    newCountry.save((err, response) => {
        if (err) {
            res.json({
                msg: 'You are getting error please check',
                error: err
            })
        } else {
            res.json({
                msg: "Country added successfully",
                data: response
            })
        }
    });
});

//Add states
router.post('/addStates', verify, (req, res) => {
    countryModel.findOne({ countryName: req.body.countryName.toUpperCase() }, (err, response) => {
        const newState = new stateModel({
            countryId: response._id, //Assign conutry id
            stateName: req.body.stateName.toUpperCase()
        });

        //create new state
        newState.save((err, response) => {
            if (err) {
                res.json({
                    msg: 'You are getting error please check',
                    error: err
                })
            } else {
                res.json({
                    msg: "State added successfully for the country: " + req.body.countryName,
                    data: response
                })
            }
        });
    });
});

//Add district information
router.post('/AddDistricts', verify, (req, res) => {
    stateModel.findOne({ stateName: req.body.stateName.toUpperCase() }, (err, response) => {

        const newDistrict = new districtModel({
            stateId: response._id, //Assign state id
            districtName: req.body.districtName
        });

        console.log(response);

        //create new state
        newDistrict.save((err, response) => {
            if (err) {
                res.json({
                    msg: 'You are getting error please check',
                    error: err,
                    status:false
                })
            } else {
                res.json({
                    msg: "District added successfully for the state: " + req.body.stateName,
                    data: response,
                    status:false
                })
            }
        });
    });
});

//get countries details
router.get('/getCountries', verify, (req, res) => {
    countryModel.find((err, data) => {
        if (err) {
            res.json({
                msg: 'You are getting error please check',
                error: err
            })
        } else {
            res.json({
                data: data
            })
        }
    });
});

//get state details

router.post('/getStates', verify, (req, res) => {
    countryName = req.body.countryName.toUpperCase();

    countryModel.findOne({ countryName: countryName }, (err, data) => { //Find the country Id
        if (data === null) {
            res.json({
                "msg": "Please enter correct country name",
                "stateInsert": false
            });
        }
        else {
            stateModel.find({ countryId: data._id }, (err, response) => { //Assign country id to state id fetch data from state model
                if (response.length === 0) {
                    res.json({
                        "msg": "No States available for selected country",
                        "stateInsert": false
                    });
                } else {
                    res.json({
                        data: response,
                        "stateInsert": true
                    });
                }
            });
        }
    });
});

module.exports = router;