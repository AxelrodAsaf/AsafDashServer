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
    },
    news: {
        type: Array,
        default: ['World', 'United States', 'Politics', 'Business', 'Science', 'Sports', 'Technology', 'Education']
    },
    weather: {
        type: Array,
        default: ['Seattle', 'Tel Aviv', 'New York', 'Los Angeles', 'Chicago', 'Paris', 'London', 'Paris', 'Berlin', 'Tokyo']
    },
    todolist: {
        type: Array,
        default: ['List Item 1', 'List Item 2', 'List Item 3']
    },
    externallinks: {
        type: Array,
        default: ['www.google.com', 'www.facebook.com', 'www.linkedin.com', 'www.youtube.com', 'www.instagram.com', 'www.reddit.com']
    },
    lastTokenVerif: {
        type: Object,
        default: {}
    }
},{timeseries: true});

// Export the schema
module.exports = mongoose.model("User", userSchema)
