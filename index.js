const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authController = require("./Controllers/authController");
const userData = require("./Controllers/userData");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config()


// Connection to the mongodb server
mongoose.set("strictQuery", false);
const mongooseURL = process.env.REACT_APP_MONGOOSE_URL;
mongoose.connect(mongooseURL, {})
    .then(() => {
        console.log("Connected to monbodb successfully.");
        console.log('\x1b[32m%s\x1b[0m', `+----------------------------+`);
    })
    .catch(error => {
        console.log("There was an error.");
        console.log(error);
    })

// Help parse the body of the request
app.use(bodyParser.json());

// Permit all to send/receive data
app.use(cors());

// When the client tries to react a certain '/XXX' call a function (authController.XXX)
app.post("/signup", authController.signup);
app.post("/login", authController.login);

// Using app.use make sure that the token is valid for all requests
app.use(authController.token);

// When the client tries to call '/getInfo' with a GET request, call a function (userData.getInfo)
app.get("/getInfo/:topic", userData.getInfo);

// When the client tries to call 'updateInfo' with a PUT request, call a function (userData.updateInfo)
app.put("/updateInfo", userData.updateInfo);

// Run the server on port 8000 with a console.log to tell the backend "developer"
app.listen(8000, () => {
    console.log('\x1b[32m%s\x1b[0m', `+----------------------------+`);
    console.log("Starting connection to port 8000.");
});


// ++++++++++++++++++ Console.log() commands to change colors of the output: ++++++++++++++++++
// console.log('\x1b[31m%s\x1b[0m', 'This text is red.');
// console.log('\x1b[32m%s\x1b[0m', 'This text is green.');
// console.log('\x1b[33m%s\x1b[0m', 'This text is yellow.');
// console.log('\x1b[34m%s\x1b[0m', 'This text is blue.');
// console.log('\x1b[35m%s\x1b[0m', 'This text is magenta.');
// console.log('\x1b[36m%s\x1b[0m', 'This text is cyan.');
// console.log('\x1b[37m%s\x1b[0m', 'This text is white.');
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++