const User = require("../models/User")
const bcrypt = require('bcrypt')



// Define and export the function 'signup'
exports.signup = (req, res) => {
    const { firstName, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({ firstName: firstName, email: email, password: hash });

    console.log(`Attempting to save newUser: ${newUser}`)

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
// exports.login = (req, res) => {
//     User.findOne({
//         email: req.body.email,
//         password: req.body.password
//     },
//         (error, user) => {
//             // Found the user
//             if (user &&
//                 (user.email === req.body.email) &&
//                 (user.password === req.body.password)) {
//                 res.status(200).json({ message: "Congrats! You're signed in now." })
//             } else if (!error) {
//                 // Didn't find the user
//                 res.status(401).json({ message: "Wrong user credentials." })
//                 console.log("Wrong user credentials")
//             } else {
//                 // Another error
//                 res.status(500).send(error)
//                 console.log("Internal server error")
//             }
//         }
//     )
// }

