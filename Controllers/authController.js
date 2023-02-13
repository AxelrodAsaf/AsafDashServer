const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key for signing JWT
const secretKey = process.env.JWT_SECRET_KEY;

// Define and export the function 'signup'
exports.signup = (req, res) => {
    const { firstName, lowerEmail, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({ firstName: firstName, email: lowerEmail, password: hash });

    console.log(`Attempting to save newUser: ${newUser}`);

    newUser.save((err) => {
        if (err) {
            if (err.code === 11000) { // Duplicate Key
                return res.status(409).json({ message: err });
            }
            else { // Different error
                return res.status(500).json({ message: err });
            }
        }
        return res.json({ message: "Task added successfully" });
    });
}

// Define and export the function 'login'
exports.login = async (req, res) => {
    email = req.body.lowerLoginEmail;
    cleanPassword = req.body.loginPass;

    // Find a user with the given email
    const user = await User.findOne({ email })
    if (user) {
        // Check if the password is correct
        const isMatch = bcrypt.compareSync(cleanPassword, user.password);
        if (isMatch) {
            // Password is correct
            const payload = {
                email: user.email,
            }
            const token = jwt.sign(payload, secretKey);
            console.log(`${email} logged in with token: ${token}`);
            res.status(200).json({ token: token, firstName: user.firstName, email: user.email });
        }
        // Password is incorrect
        else {
            return res.status(401).json({ message: "Incorrect password" });
        }
    }
    // User not found
    else {
        console.log(`User not found`);
        return res.status(400).json({ message: "User not found." })
    }
}

// 1. When the client sends a get request to '/token' reply with "Token verified" after verification
// 2. When the client makes any request to the server, check if the token is valid
exports.token = async (req, res, next) => {
    if (req.headers.authorization !== undefined) {
        [, token] = req.headers.authorization.split(' ');
        // Verify token
        if (token !== undefined) {
            var payload = '';
            try {
                // Verify the JWT
                payload = jwt.verify(token, secretKey);
                // Access the payload of the JWT
                console.log('\x1b[32m%s\x1b[0m', `Verified token of user: ${payload.email}`);
                // Add the user's email (from the token) to the request
                req.user = payload.email;
            } catch (error) {
                // Handle error
                console.error(error.message);
            }
        }
    }
    // Continue to the next handler (with or without the user's email)
    next();
}

// When the client calls '/getInfo' using the 'GET' method, the server responds with a JSON array of all the relevant info from the database
exports.getInfo = async (req, res) => {
    // If there isn't a user's email in the request, find the 'default' user in the database
    if (req.headers.user === undefined) {
        // Find the 'default' user in the database
        const user = await User.findOne({ email: 'default' });
        topic = req.params.topic;
        topic = topic.toLowerCase();
        const result = user[topic];
        // Send the default data to the client
        console.log(`\x1b[35m%s\x1b[0m`, `'${topic}' default data sent to a user`);
        res.status(200).json(result);
    }
    // If an email is in the request, try to find the user in the database and retrieve the news array
    else {
        // Using the email given in the request, find the user
        try {
            const user = await User.findOne({ email: req.headers.user });
            topic = req.params.topic;
            const lowerTopic = topic.toLowerCase();
            const result = user[lowerTopic];
            // Send the result array to the client
            console.log(`\x1b[35m%s\x1b[0m`, `'${lowerTopic}' sent to '${user.email}'`);
            res.status(200).json(result);
        }
        // There was an email in the request, but the user was not found in the database, or another error occurred
        catch (error) {
            console.error(error.message);
            res.status(error.status).json({ message: error.message });
        }
    }
}

// When the client calls '/updateInfo' using the 'POST' method, the server updates the data in the database
exports.updateInfo = async (req, res) => {
    // If there isn't a user's email in the request, return an error
    if (req.user === undefined) {
        return res.status(404).json({ message: "No user found" });
    }


    try {
        // Find the user in the database using their email
        const user = await User.findOne({ email: req.user });
        // Check to see if there is a topic in the request headers
        if (req.headers.topic === undefined) {
            return res.status(400).json({ message: "No topic specified" });
        }
        // Retrieve the 'topic' variable from the request headers
        const topic = req.headers.topic.toLowerCase();
        // Retrieve the 'updateArray' variable from the request body
        const updateArray = req.body.updateArray.map(s => s.trim());
        // Update the user's data in the database with the new 'updateArray' array under the key 'topic'
        user[topic] = updateArray;
        // Save the user to the database
        user.save((err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            console.log(`\x1b[33m%s\x1b[0m`, `'${topic}' updated for user: ${user.email}`);
            return res.status(200).json(user);
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};
