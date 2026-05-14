const mongoose = require("mongoose");

const example = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: { 
        type: String,
        required: true,
        unique: true
    },
    username: String,
    password: String
});

module.exports = mongoose.model("User", example);