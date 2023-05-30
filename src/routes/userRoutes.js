const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Hiển thị form đăng ký
router.get('/registerform', AuthController.showRegistrationForm);

// Xử lý đăng ký user
router.post('/register', AuthController.registerUser);
router.get('/loginform', AuthController.showLoginForm);
router.post('/login', AuthController.loginUser);
router.get('/logout', AuthController.logoutUser);


module.exports = router;
