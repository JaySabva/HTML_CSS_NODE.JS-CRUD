const mongoose = require('mongoose');
const User = require('../models/user');
const express = require('express');
const fs = require('fs');
const path = require('path');
const exceljs = require('exceljs');
const {v4 : uuidv4} = require('uuid')

const excelFile = path.join(__dirname, '../db.xlsx');
// exports.registerUser = async (req, res, next) => {
//     try {
//         if (req.body.name == "" || req.body.email == "" || req.body.mobileNumber == "" || req.body.country == "" || req.body.state == "" || req.body.city == "" || req.body.address == "" || req.body.aadharnumber == "" || req.body.pancard == "") {
//             return res.status(400).json({
//                 message: "Please fill all the fields"
//             });
//         }
//
//         const newUser = new User({
//             name: req.body.name,
//             email: req.body.email,
//             mobileNumber: req.body.mobileNumber,
//             country: req.body.country,
//             state: req.body.state,
//             city: req.body.city,
//             address: req.body.address,
//             aadharnumber: req.body.aadharnumber,
//             pancard: req.body.pancard
//         });
//         await newUser.save();
//
//         return res.status(201).json({
//             message: "User added successfully",
//             user: newUser
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     }
// }
//
// exports.getUsers = async (req, res, next) => {
//     try {
//         if (req.query.id)
//         {
//             const u = await User.findById(req.query.id);
//             return res.status(200).json({
//                 user: u
//             });
//         }
//         const users = await User.find();
//         return res.status(200).json({
//             users: users
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     }
// }

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

// exports.deleteUser = async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         await User.deleteOne({_id: id});
//         return res.status(200).json({
//             message: "User deleted successfully"
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     }
// }

exports.registerUser = async (req, res, next) => {
    try {
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(excelFile);

        const worksheet = workbook.getWorksheet('Users');
        const header = worksheet.getRow(1).values;

        let rowIndex = 2;
        while (worksheet.getRow(rowIndex).getCell(1).value) {
            rowIndex++;
        }

        const newRow = worksheet.getRow(rowIndex);

        req.body._id = uuidv4();
        newRow.getCell(1).value = req.body._id;
        header.forEach((h, i) => {
            newRow.getCell(i).value = req.body[h];
        });

        await workbook.xlsx.writeFile(excelFile);

        return res.status(201).json({
            message: "User added successfully"
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
        if (req.query.id) {
            const workbook = new exceljs.Workbook();
            await workbook.xlsx.readFile(excelFile);

            const worksheet = workbook.getWorksheet('Users');
            const header = worksheet.getRow(1).values;

            let rowIndex = 2;
            while (worksheet.getRow(rowIndex).getCell(1).value != req.query.id) {
                rowIndex++;
            }

            let user = {};
            header.forEach((h, i) => {
                user[h] = worksheet.getRow(rowIndex).getCell(i).value;
            });

            return res.status(200).json({
                user: user
            });
        }
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(excelFile);

        const worksheet = workbook.getWorksheet('Users');
        const header = worksheet.getRow(1).values;

        let users = [];
        let rowIndex = 2;
        while (worksheet.getRow(rowIndex).getCell(1).value) {
            let user = {};
            header.forEach((h, i) => {
                user[h] = worksheet.getRow(rowIndex).getCell(i).value;
            });
            users.push(user);
            rowIndex++;
        }

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
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(excelFile);

        const worksheet = workbook.getWorksheet('Users');
        const header = worksheet.getRow(1).values;

        let rowIndex = 2;
        while (worksheet.getRow(rowIndex).getCell(1).value != req.params.id) {
            rowIndex++;
        }
        header.forEach((h, i) => {
            worksheet.getRow(rowIndex).getCell(i).value = req.body[h];
        });
        await workbook.xlsx.writeFile(excelFile);

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
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(excelFile);

        const worksheet = workbook.getWorksheet('Users');
        const header = worksheet.getRow(1).values;

        let rowIndex = 2;
        while (worksheet.getRow(rowIndex).getCell(1).value != req.params.id) {
            rowIndex++;
        }
        worksheet.spliceRows(rowIndex, 1);
        await workbook.xlsx.writeFile(excelFile);


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