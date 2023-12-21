const mongoose = require('mongoose');
const User = require('../models/user');
const express = require('express');

exports.registerUser = async (req, res, next) => {
    try {
        if (req.body.name == "" || req.body.email == "" || req.body.mobileNumber == "" || req.body.country == "" || req.body.state == "" || req.body.city == "" || req.body.address == "" || req.body.aadharnumber == "" || req.body.pancard == "") {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            address: req.body.address,
            aadharnumber: req.body.aadharnumber,
            pancard: req.body.pancard
        });
        await newUser.save();

        return res.status(201).json({
            message: "User added successfully",
            user: newUser
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        if (req.query.id)
        {
            const u = await User.findById(req.query.id);
            return res.status(200).json({
                user: u
            });
        }
        const users = await User.find();
        return res.status(200).json({
            users: users
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        await User.updateOne({_id: id}, {$set: req.body});
        return res.status(200).json({
            message: "User updated successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        await User.deleteOne({_id: id});
        return res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}