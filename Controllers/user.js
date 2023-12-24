const mongoose = require('mongoose');
const User = require('../models/user');
const express = require('express');
const fs = require('fs');
const path = require('path');
const exceljs = require('exceljs');
const {v4: uuidv4} = require('uuid')
const XLXS = require('xlsx');

let excelFile = path.join(__dirname, '../db.xlsx');
exports.registerUser = async (req, res, next) => {
    try {
        if (req.body.name == "" || req.body.email == "" || req.body.mobileNumber == "" || req.body.country == "" || req.body.state == "" || req.body.city == "" || req.body.address == "" || req.body.aadharnumber == "" || req.body.pancard == "") {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        req.body.profilePhoto = null;
        if (req.file) {
            req.body.profilePhoto = req.file.path;
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
            pancard: req.body.pancard,
            profilePic: req.body.profilePhoto
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
        if (req.query.id) {
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
        console.log(req.body);
        const id = req.params.id;
        if (req.file) {
            req.body.profilePic = req.file.path;
        }
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
        const user = await User.findById(id);
        if (user.profilePic) {
            if (fs.existsSync(user.profilePic))
                fs.unlinkSync(user.profilePic);
        }
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

exports.getDataExcel = async (req, res, next) => {
    try {
        const users = await User.find();
        const data = users.map(u => [
            u._id.toString(),
            u.name,
            u.email,
            u.mobileNumber,
            u.country,
            u.state,
            u.city,
            u.address,
            u.aadharnumber,
            u.pancard,
            u.profilePic
        ]);

        const header = [
            "_id",
            "name",
            "email",
            "mobileNumber",
            "country",
            "state",
            "city",
            "address",
            "aadharnumber",
            "pancard",
            "profilePic",
            "action"
        ];

        data.unshift(header);

        const ws = XLXS.utils.aoa_to_sheet(data);

        const wb = XLXS.utils.book_new();
        XLXS.utils.book_append_sheet(wb, ws, "Users");

        const buf = XLXS.write(wb, {type: 'buffer', bookType: "xlsx"});

        res.setHeader('Content-Disposition', 'attachment; filename=labharthi_data.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.end(buf, 'binary');
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}

exports.postDataExcel = async (req, res, next) => {
    try {
        excelFile = path.join(__dirname, '../uploads/db.xlsx');
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(excelFile);

        const worksheet = workbook.getWorksheet('Users');
        const header = worksheet.getRow(1).values;

        let rowIndex = 2;
        while (worksheet.getRow(rowIndex).getCell(2).value) {
            console.log(worksheet.getRow(rowIndex).getCell(1).value);
            if (worksheet.getRow(rowIndex).getCell(12).value == "D")
            {
                await User.deleteOne({_id: worksheet.getRow(rowIndex).getCell(1).value});
            }
            else
            {
                if (worksheet.getRow(rowIndex).getCell(1).value == null)
                {
                    const newUser = new User({
                        name: worksheet.getRow(rowIndex).getCell(2).value,
                        email: worksheet.getRow(rowIndex).getCell(3).value,
                        mobileNumber: worksheet.getRow(rowIndex).getCell(4).value,
                        country: worksheet.getRow(rowIndex).getCell(5).value,
                        state: worksheet.getRow(rowIndex).getCell(6).value,
                        city: worksheet.getRow(rowIndex).getCell(7).value,
                        address: worksheet.getRow(rowIndex).getCell(8).value,
                        aadharnumber: worksheet.getRow(rowIndex).getCell(9).value,
                        pancard: worksheet.getRow(rowIndex).getCell(10).value,
                        profilePic: worksheet.getRow(rowIndex).getCell(11).value
                    });

                    await newUser.save();
                }
                else
                {
                    const id = worksheet.getRow(rowIndex).getCell(1).value;
                    const updatedUser = {
                        name: worksheet.getRow(rowIndex).getCell(2).value,
                        email: worksheet.getRow(rowIndex).getCell(3).value,
                        mobileNumber: worksheet.getRow(rowIndex).getCell(4).value,
                        country: worksheet.getRow(rowIndex).getCell(5).value,
                        state: worksheet.getRow(rowIndex).getCell(6).value,
                        city: worksheet.getRow(rowIndex).getCell(7).value,
                        address: worksheet.getRow(rowIndex).getCell(8).value,
                        aadharnumber: worksheet.getRow(rowIndex).getCell(9).value,
                        pancard: worksheet.getRow(rowIndex).getCell(10).value,
                        profilePic: worksheet.getRow(rowIndex).getCell(11).value
                    };

                    await User.updateOne({_id: id}, {$set: updatedUser});
                }
            }
            rowIndex++;
        }

        return res.status(200).json({
            message: "Data updated successfully"
        });
    } catch
        (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });

    }
}


// exports.registerUser = async (req, res, next) => {
//     try {
//         const workbook = new exceljs.Workbook();
//         await workbook.xlsx.readFile(excelFile);
//
//         const worksheet = workbook.getWorksheet('Users');
//         const header = worksheet.getRow(1).values;
//
//         let rowIndex = 2;
//         while (worksheet.getRow(rowIndex).getCell(1).value) {
//             rowIndex++;
//         }
//
//         const newRow = worksheet.getRow(rowIndex);
//
//         req.body._id = uuidv4();
//         newRow.getCell(1).value = req.body._id;
//
//         req.body.profilePic = null;
//         if (req.file)
//             req.body.profilePic = req.file.path;
//         header.forEach((h, i) => {
//             newRow.getCell(i).value = req.body[h];
//         });
//
//         await workbook.xlsx.writeFile(excelFile);
//
//         return res.status(201).json({
//             message: "User added successfully"
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
//         if (req.query.id) {
//             const workbook = new exceljs.Workbook();
//             await workbook.xlsx.readFile(excelFile);
//
//             const worksheet = workbook.getWorksheet('Users');
//             const header = worksheet.getRow(1).values;
//
//             let rowIndex = 2;
//             while (worksheet.getRow(rowIndex).getCell(1).value != req.query.id) {
//                 rowIndex++;
//             }
//
//             let user = {};
//             header.forEach((h, i) => {
//                 user[h] = worksheet.getRow(rowIndex).getCell(i).value;
//             });
//
//             return res.status(200).json({
//                 user: user
//             });
//         }
//         const workbook = new exceljs.Workbook();
//         await workbook.xlsx.readFile(excelFile);
//
//         const worksheet = workbook.getWorksheet('Users');
//         const header = worksheet.getRow(1).values;
//
//         let users = [];
//         let rowIndex = 2;
//         while (worksheet.getRow(rowIndex).getCell(1).value) {
//             let user = {};
//             header.forEach((h, i) => {
//                 user[h] = worksheet.getRow(rowIndex).getCell(i).value;
//             });
//             users.push(user);
//             rowIndex++;
//         }
//
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
//
// exports.updateUser = async (req, res, next) => {
//     try {
//         const workbook = new exceljs.Workbook();
//         await workbook.xlsx.readFile(excelFile);
//
//         const worksheet = workbook.getWorksheet('Users');
//         const header = worksheet.getRow(1).values;
//
//         let rowIndex = 2;
//         while (worksheet.getRow(rowIndex).getCell(1).value != req.params.id) {
//             rowIndex++;
//         }
//
//         req.body.profilePic = worksheet.getRow(rowIndex).getCell(11).value;
//         if (req.file)
//             req.body.profilePic = req.file.path;
//         header.forEach((h, i) => {
//             worksheet.getRow(rowIndex).getCell(i).value = req.body[h];
//         });
//         await workbook.xlsx.writeFile(excelFile);
//
//         return res.status(200).json({
//             message: "User updated successfully"
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     }
// }
//
// exports.deleteUser = async (req, res, next) => {
//     try {
//         const workbook = new exceljs.Workbook();
//         await workbook.xlsx.readFile(excelFile);
//
//         const worksheet = workbook.getWorksheet('Users');
//         const header = worksheet.getRow(1).values;
//
//         let rowIndex = 2;
//         while (worksheet.getRow(rowIndex).getCell(1).value != req.params.id) {
//             rowIndex++;
//         }
//         worksheet.spliceRows(rowIndex, 1);
//         await workbook.xlsx.writeFile(excelFile);
//
//
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