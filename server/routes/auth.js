const express = require('express');
const { signup , signin, accountActivation, forgotPassword , resetPassword ,googleLogin} = require('../controllers/auth');

// import validator
const {userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator} = require('../validators/auth');
const {runValidation} = require('../validators/index');


const router = express.Router();

router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/signin', userSigninValidator, runValidation, signin)
router.post('/account-activation', accountActivation)
// forgot resetp password
router.put('/forgot-password', forgotPasswordValidator, runValidation ,forgotPassword)
router.put('/reset-password', resetPasswordValidator, runValidation ,resetPassword)
// handle google login
router.post('/google-login', googleLogin)



module.exports = router;