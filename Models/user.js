const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        match: /^[a-zA-Z ]{2,30}$/
    },
    email: {
        type: String,
        required: true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    mobileNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/,
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    aadharnumber: {
        type: String,
        required: true,
        match:/^\d{4} \d{4} \d{4}$/
    },
    pancard: {
        type: String,
        required: true,
        match:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    },
    profilePic: {
        type: String
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;