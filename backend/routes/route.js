//Import express router to craete routers
const express = require('express');
const router = express.Router();

//Import JOI for schema input validation
const Joi = require('@hapi/joi');

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

    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(10).required()
    });

    schema.validate(req.body);

    const { error, value } = schema.validate(req.body);

    if (!error) {
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
        });
    } else {
        res.json({
            error: error
        });
    }
});


router.post('/login', (req, res) => {

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error, value } = schema.validate(req.body);
    if (!error) {
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
    } else {
        res.json({
            Error: error
        });
    }

});


//Add Countries
router.post('/addCountries', verify, (req, res) => {
    const schema = Joi.object({
        countryName: Joi.string().regex(/^[a-z]$/).required()
    });

    const { error, value } = schema.validate(req.body);
    if (!error) {
        const newCountry = new countryModel({
            countryName: req.body.countryName.toUpperCase()
        });

        newCountry.save((err, response) => {
            if (err) {
                res.json({
                    msg: 'You are getting error please check',
                    error: err
                });
            } else {
                res.json({
                    msg: "Country added successfully",
                    data: response
                })
            }
        });
    } else {
        res.json({
            Error: "CountryName should contains only characters",
            InterpreterError: error
        });
    }
});

//Add states
router.post('/addStates', verify, (req, res) => {

    const schema = Joi.object({
        countryName: Joi.string().regex(/^[a-z]$/),
        stateName: Joi.string().regex(/^[a-z]$/)
    });

    const { error, value } = schema.validate(req.body);

    if (!error) { } else {
        res.json({
            Error: "Both fields must be required and must contain only characters",
            InterpretedError: error
        });
    }
});

//Add district information
router.post('/AddDistricts', verify, (req, res) => {

    const schema = Joi.object({
        stateName: Joi.string().regex(/^[a-z]$/),
        districtName: Joi.string().regex(/^[a-z]$/)
    });

    const { error, value } = schema.validate(req.body);

    if (!error) {
        stateModel.findOne({ stateName: req.body.stateName.toUpperCase() }, (err, response) => {

            const newDistrict = new districtModel({
                stateId: response._id, //Assign state id
                districtName: req.body.districtName
            });

            //create new state
            newDistrict.save((err, response) => {
                if (err) {
                    res.json({
                        msg: 'You are getting error please check',
                        error: err,
                        status: false
                    })
                } else {
                    res.json({
                        msg: "District added successfully for the state: " + req.body.stateName,
                        data: response,
                        status: false
                    })
                }
            });
        });
    } else {
        res.json({
            Error: "Both fields must be required and must contain only characters",
            InterpretedError: error
        });
    }
});

/**
 * get countries details
 * No Need of validation for the GET request
 */
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

/**
 * get States details
 */
router.post('/getStates', verify, (req, res) => {

    const schema = Joi.object({
        countryName: Joi.string().required().regex(/^[a-z]$/)
    });

    const { error, value } = schema.validate(req.body);

    if (!error) {

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
    } else {
        res.json({
            Error: "fields must be required and must contain only characters",
            InterpretedError: error
        });
    }
});

/**
 * get countries details
 * No Need of validation for the GET request
 * Duplicated and function used in frontend register.service.ts
 * I will be careful
 */
router.get('/getAllCountries', (req, res) => {
    countryModel.find((err, doc) => {
        res.json({
            data: doc
        })
    });
});

/**
 * get States details
 * No Need of validation for the GET request 
 */

router.get('/getAllStates', (req, res) => {
    stateModel.find((err, response) => {
        res.json({
            data: response
        });
    });
});

//get single District value
router.post('/getSingleDistrict', (req, res) => {
    const schema = Joi.object({
        districtId: Joi.string().required().regex(/^[a-z]$/)
    });

    const { error, value } = schema.validate(req.body);

    if (!error) {
        districtModel.find({ _id: req.body.districtId }, (err, response) => {
            res.json({
                data: response
            });
        });
    } else {
        res.json({
            Error: "Both fields must be required and must contain only characters",
            InterpretedError: error
        });
    }
});

/**
 * No Need of validation
 * to get all districts No parameters required
 */
router.get('/getDistricts', (req, res) => {
    districtModel.find((err, response) => {
        res.json({
            data: response
        })
    });
});

/**
 * Fetch Single country and single state 
 * according to district selected from frontend
 */

router.post('/getSingleStateAndCountry', (req, res) => {

    const schema = Joi.object({
        districtName: Joi.string().required().regex(/^[a-z]$/)
    });

    const { error, value } = schema.validate(req.body);

    if (!error) {
        let SingleStateAndCountry = [];
        districtModel.find({ districtName: req.body.districtName }, (err, response) => {
            stateModel.find({ _id: response[0].stateId }, (err, response) => {
                SingleStateAndCountry.push({ 'state': response[0].stateName });
                countryModel.find({ _id: response[0].countryId }, (err, doc) => {
                    SingleStateAndCountry.push({ 'country': doc[0].countryName });
                    res.json(SingleStateAndCountry);
                });
            });
        });
    } else {
        res.json({
            Error: "fields must be required and must contain only characters",
            InterpretedError: error
        });
    }
});

/**
 * Edit all data at once
 */
router.post('/EditAllAtOnce', (req, res) => {

    const schema = Joi.object({
        id: Joi.string().required(),
        countryName: Joi.object().regex(/^[a-z]$/),
        stateName: Joi.object().regex(/^[a-z]$/),
        districtName: Joi.object().regex(/^[a-z]$/),
    });

    const { error, value } = schema.validate(req.body);

    if (!error) {
        let id = req.body.id;
        let countryName = req.body.countryName;
        let stateName = req.body.stateName;
        let districtName = req.body.districtName;

        //Fetch state id and change it to district state id       
        stateModel.find({ stateName: stateName }, (err, response) => {
            districtModel.findOneAndUpdate({ _id: id }, { stateId: response[0]._id, districtName: districtName }, (err, doc) => {
            });
        });

        countryModel.find({ countryName: countryName }, (err, doc) => {
            stateModel.findOneAndUpdate({ stateName: stateName }, { countryId: doc[0]._id }, (err, doc) => {
                res.json({
                    msg: "Data Updated"
                });
            });
        });
    } else {
        res.json({
            Error: "fields must be required and must contain only characters",
            InterpretedError: error
        });
    }
});

/**
 * Get number of maximum documents
 * it's used to get all the data and combine states and districts and countries
 * The logic is at frontend district-list component
 */
router.get('/bigCount', (req, res) => {
    countryModel.count((err, countryCount) => {
        stateModel.count((err, stateCount) => {
            districtModel.count((err, districtCount) => {
                count = Math.max(countryCount, stateCount, districtCount);
                res.json({
                    'maxCount': count
                });
            });
        });
    });
});

/**
 * The following function is used to combine all countries, states and districts
 * this function is also used in district-list component
 */
router.post("/getAllInformation", (req, res) => {
    let countryInfo = [];
    districtModel.find({ _id: req.body.districtId }, (err, districts) => {
        stateModel.find({ _id: districts[0].stateId }, (err, states) => {
            countryModel.find({ _id: states[0].countryId }, (err, countries) => {
                countryInfo.push({
                    _id: districts[0]._id,
                    DistrictName: districts[0].districtName,
                    StateName: states[0].stateName,
                    CountryName: countries[0].countryName
                });
                res.json({
                    data: countryInfo
                });
            });
        });
    });
});

router.post("/deleteCountry", (req, res) => {
    stateModel.countDocuments({ countryId: req.body.countryId }, (err, count) => {
        if (count === 0) {
            countryModel.findOneAndDelete({_id: req.body.countryId}, (error, results) => {
                res.json({
                    msg: "You have successfully removed " + results.countryName
                });
            });
        } else {
            res.json({
                msg: "States are depending on this country please delete states first"
            });
        }
    });
});

module.exports = router;