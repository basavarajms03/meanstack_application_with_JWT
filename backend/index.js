//Import Modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

//dbconnection
require('./config/dbcon');

//Declare cors
app.use(cors());

//Custom components
const routes = require('./routes/route');

//Import middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Bind routes
app.use('/api', routes);

const port = process.env.port || 3000 ;

//Start express server with the port number
app.listen(port, () => {
    console.log("Sample Project Application is listening with port"+port);
});
