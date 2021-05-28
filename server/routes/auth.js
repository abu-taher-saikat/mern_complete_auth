const express = require('express');
const { signup , signin, accountActivation } = require('../controllers/auth');

// import validator
const {userSignupValidator, userSigninValidator} = require('../validators/auth');
const {runValidation} = require('../validators/index');


const router = express.Router();

router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/signin', userSigninValidator, runValidation, signin)
router.post('/account-activation', accountActivation)



module.exports = router;