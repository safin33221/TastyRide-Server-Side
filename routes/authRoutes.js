const express = require('express')

const { registerUser, getUsers, getUserRole } = require('../controller/authController')
const router = express.Router()


//get User 
router.get('/users',getUsers)

//Post New User
router.post('/register', registerUser)

//get user role by email
router.get('/role/:email',getUserRole)

module.exports = router