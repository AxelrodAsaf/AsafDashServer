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
                return res.status(409).json({message: err});
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
            res.status(200).json({ token: token, firstName: user.firstName, email: user.email });
        }
    }
    // User not found
    else {
        console.log(`User not found`);
        return res.status(400).json({ message: "User not found." })
    }
}

exports.token = async (req, res) => {
    // Verify token
    var payload = '';
    const token = req.headers.authorization.split(" ")[1];
    try {
        // Verify the JWT
        payload = jwt.verify(token, secretKey);
        // Access the payload of the JWT
        console.log(payload);
        res.status(200).json({ message: "Token verified"});
    } catch (error) {
        // Handle error
        console.error(error.message);
        res.status(401).json({ message: "Unauthorized" });
    }
}