const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    countryName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Countries', countrySchema);