const mongoose = require('mongoose');

const DistrictSchema = mongoose.Schema({
    stateId:{
        type: String,
        requied: true
    },
    districtName:{
        type:String,
        requied: true
    }
});

module.exports = mongoose.model('District', DistrictSchema);