const express = require ('express');
const { registerMember } = require('../Controllers/authController');
const router = express.Router()
router.post('/register' , registerMember )




module.exports = router ;