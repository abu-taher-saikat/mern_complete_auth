const express = require('express');
const { signup } = require('../controllers/auth');

// import validator
const {userSignupValidator} = require('../validators/auth');
const {runValidation} = require('../validators/index');


const router = express.Router();

router.post('/signup', userSignupValidator, runValidation, signup)



module.exports = router;