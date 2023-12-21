const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/register', userController.registerUser);
router.get('/users', userController.getUsers);
router.patch('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;