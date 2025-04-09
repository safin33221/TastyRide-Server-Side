const express = require('express')

const { 
    registerUser, 
    getUsers, 
    getUser, 
    updateUserRole, 
    deleteUser, 
    updateResturantProfile, 
    updateUserProfile, 
    logInAttempts, 
    getRestaurantProfile, 
    allRestaurants,
    subscribeToNewsletter
 } = require('../controller/authController')
const router = express.Router()


//get User 
router.get('/users', getUsers)

//Post New User
router.post('/register', registerUser)

// post login user for check password validation
router.post('/login', logInAttempts)

//get user role by email
router.get('/users/:email', getUser)

// get restaurant profile by email
router.get('/restaurantProfile/:email', getRestaurantProfile)

//get restaurant Profile
router.get('/allRestaurants', allRestaurants)

// Update user role
router.put('/users/:id', updateUserRole);

router.patch('/restaruntProfile/:email', updateResturantProfile);

// update user profile
router.patch('/users/:email', updateUserProfile);

// Delete a user
router.delete('/users/:id', deleteUser);

// subscribe to newsletter
router.patch('/subscribe/:email', subscribeToNewsletter)

module.exports = router