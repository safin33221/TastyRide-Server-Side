const express = require('express');
const {
  applyRestaurant,
  getAllRestaurantsApplications,
  updateStatus,
  getRestaurantData,
  updateRestaurantProfile,
  allApprovedRestaurant,
  getRestaurantProfile
} = require('../controller/restaurantController');

const router = express.Router();

// Apply for restaurant
router.post('/restaurants/application/:userEmail', applyRestaurant);

// Get all applications
router.get('/restaurants-applications', getAllRestaurantsApplications);

//get Approved Restaurant Data
router.get('/allApprovedRestaurant', allApprovedRestaurant)

// Update application status
router.patch('/update-status', updateStatus);

//get Single Restaurant
router.get('/restaurant/:email', getRestaurantData)

//Update Restaurant Data 
router.patch('/restaurantProfileUpdate/:email', updateRestaurantProfile);

// get restaurant profile by email
router.get('/SingleRestaurantProfile/:email', getRestaurantProfile)

module.exports = router;
