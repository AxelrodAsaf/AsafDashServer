const mongoose = require("mongoose");

// Define a way to save a certain set of fields of data
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    }
    
})

// Export the schema
module.exports = mongoose.model("User", userSchema)
