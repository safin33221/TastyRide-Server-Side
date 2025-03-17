const express = require('express')
const User = require('../model/authModel')
const { registerUser } = require('../controller/authController')
const router = express.Router()


//get User 



//Post New User
router.post('/register', registerUser)

module.exports = router