const express = require('express')

const { 
    registerUser, 
    getUsers, 
    getUser, 
    updateUserRole, 
    deleteUser, 
    updateRestaurantProfile, 
    updateUserProfile, 
    logInAttempts, 
    getRestaurantProfile, 
    allRestaurants,
    subscribeToNewsletter,
    getSubscribedUser,
    followRestaurant,
    getFollowedRestaurant
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

router.patch('/restaurantProfile/:email', updateRestaurantProfile);

// update user profile
router.patch('/users/:email', updateUserProfile);

// Delete a user
router.delete('/users/:id', deleteUser);

// subscribe to newsletter
router.patch('/subscribe', subscribeToNewsletter);

// get the subscribed user
router.get('/subscribe/:email', getSubscribedUser);

// follow or unfollow a restaurant
router.patch('/restaurant/follow', followRestaurant);

// get followed restaurant
router.get('/restaurant/follow', getFollowedRestaurant);

module.exports = router