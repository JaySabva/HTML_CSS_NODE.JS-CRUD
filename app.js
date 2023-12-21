const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const userRoutes = require('./routes/user');

mongoose.connect("mongodb+srv://Group16:Group16@cluster0.vfhbrkw.mongodb.net/User_Form?retryWrites=true&w=majority", {
});


// CORS error handling
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // * = any origin
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization" // Which headers are allowed
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); // Which methods are allowed
        return res.status(200).json({});
    }
    next();
});

app.use('/user', userRoutes);

// ERROR HANDLING
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404; // 404 = not found
    next(error);
});

app.use((error, req, res, next) => {
    return res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;