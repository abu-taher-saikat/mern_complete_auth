const express = require('express');
const router = express.Router();
const { read , update } = require('../controllers/user');
const {requireSignin} = require('../controllers/auth');



router.get('/user/:id', read)
router.put('/user/update/:id', update)




module.exports = router;