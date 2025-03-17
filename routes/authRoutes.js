const express = require('express')

const { registerUser, getUsers } = require('../controller/authController')
const router = express.Router()


//get User 
router.get('/users',getUsers)

//Post New User
router.post('/register', registerUser)

module.exports = router