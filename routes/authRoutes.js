const express = require('express')

const { 
    registerUser, 
    getUsers, 
    getUser, 
    updateUserRole, 
    deleteUser,  
    updateUserProfile, 
    logInAttempts,
    allRestaurants,
    subscribeToNewsletter,
    getSubscribedUser,
    getFollowedRestaurant,
    getFollowedRestaurantsByUser
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

//get restaurant Profile
router.get('/allRestaurants', allRestaurants)

// Update user role
router.put('/users/:id', updateUserRole);


// update user profile
router.patch('/users/:email', updateUserProfile);

// Delete a user
router.delete('/users/:id', deleteUser);

// subscribe to newsletter
router.patch('/subscribe', subscribeToNewsletter);

// get the subscribed user
router.get('/subscribe/:email', getSubscribedUser);


// get followed restaurant
router.get('/restaurant/follow', getFollowedRestaurant);

// get followed restaurant by user
router.get('/users/following-restaurants/:email', getFollowedRestaurantsByUser);

module.exports = router