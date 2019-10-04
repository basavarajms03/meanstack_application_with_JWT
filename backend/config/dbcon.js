const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/StateCountries";

mongoose.set('useFindAndModify', false);

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true} , () => {
    console.log("Sample Project connected to mongoDb");
});