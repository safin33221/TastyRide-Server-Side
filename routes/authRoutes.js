const express = require('express')

const { registerUser, getUsers, getUser, updateUserRole, deleteUser, updateResturantProfile, updateUserProfile} = require('../controller/authController')
const router = express.Router()


//get User 
router.get('/users', getUsers)

//Post New User
router.post('/register', registerUser)

//get user role by email
router.get('/users/:email', getUser)

// Update user role
router.put('/users/:id', updateUserRole);

router.patch('/restaruntProfile/:email', updateResturantProfile);

// update user profile
router.patch('/users/:email', updateUserProfile);


// Delete a user
router.delete('/users/:id', deleteUser);

module.exports = router