const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authController = require("./Controllers/authController");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config()

// Connection to the mongodb server
mongoose.set("strictQuery", false);
const mongooseURL = process.env.REACT_APP_MONGOOSE_URL;
mongoose.connect(mongooseURL, {})
    .then(() => console.log("Connected to monbodb successfully."))
    .catch(error => {
        console.log("There was an error.");
        console.log(error);
    })

// Help parse the body of the request
app.use(bodyParser.json());

// Permit all to send/receive data
app.use(cors());

// Using app.use make sure that the token is valid for all requests
app.use(authController.token);

// When the client tries to react a certain '/XXX' call a function (authController.XXX)
app.post("/signup", authController.signup);
app.post("/login", authController.login);

// When the client tries to call '/news' with a GET request, call a function (newsController.getNews)
app.get("/getInfo", authController.getInfo);

// Run the server on port 8000 with a console.log to tell the backend "developer"
app.listen(8000, () => console.log("Starting connection to port 8000."));
