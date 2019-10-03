const mongoose = require('mongoose');

const stateSchema = mongoose.Schema({
    countryId:{
        type: String,
        requied: true
    },
    stateName:{
        type:String,
        requied: true
    }
});

module.exports = mongoose.model('States', stateSchema);