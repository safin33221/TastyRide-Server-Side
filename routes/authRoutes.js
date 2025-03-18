const express = require('express')

const { registerUser, getUsers, getUser } = require('../controller/authController')
const router = express.Router()


//get User 
router.get('/users',getUsers)

//Post New User
router.post('/register', registerUser)

//get user role by email
router.get('/users/:email', getUser)

module.exports = router