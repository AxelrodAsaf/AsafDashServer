const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authController = require("./Controllers/authController");
const bodyParser = require("body-parser");
const cors = require('cors');

// Connection to the mongodb server
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://Asaf:123@cluster0.ytrt7ka.mongodb.net/Dashboard?retryWrites=true&w=majority", {})
    .then(() => console.log("Connected to monbodb successfully."))
    .catch(error => {
        console.log("There was an error.");
        console.log(error);
    })

// Help parse the body of the request
app.use(bodyParser.json());

// Permit all to send/receive data
app.use(cors());

// When the client tries to react a certain '/XXX' call a function (authController.XXX)
app.post("/signup", authController.signup)
app.post("/login", authController.login)

// Run the server on port 8000 with a console.log to tell the backend "developer"
app.listen(8000, () => console.log("Starting connection to port 8000."));
