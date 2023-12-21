const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

const { profilePhoto } = require('../middleware/image');
const profilePhotoUpload = profilePhoto.single('profilePhoto');

router.post('/register', profilePhotoUpload, userController.registerUser);
router.get('/users', userController.getUsers);
router.patch('/update/:id', profilePhotoUpload, userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;