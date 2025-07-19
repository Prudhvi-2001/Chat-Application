const express = require('express');
const router = express.Router();
const { signIn, signUp,getUserProfile,searchUsersList } = require('../controllers/authController');
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/profile', authMiddleware, getUserProfile)
router.get('/search-users', authMiddleware, searchUsersList)


module.exports = router;
