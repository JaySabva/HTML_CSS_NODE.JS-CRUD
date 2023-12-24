const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

const { profilePhoto } = require('../middleware/image');
const { excelFile } = require('../middleware/excel');

const profilePhotoUpload = profilePhoto.single('profilePhoto');
const excelFileUpload = excelFile.single('excelFile');

router.post('/register', profilePhotoUpload, userController.registerUser);
router.get('/users', userController.getUsers);
router.patch('/update/:id', profilePhotoUpload, userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);


router.get('/dataexcel', userController.getDataExcel);
router.post('/dataexcel',excelFileUpload, userController.postDataExcel);
module.exports = router;