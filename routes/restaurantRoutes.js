const express = require('express');
const {
  applyRestaurant,
  getAllRestaurantsApplications,
  updateStatus,
  getRestaurantData,
  updateRestaurantProfile,
  allApprovedRestaurant
} = require('../controller/restaurantController');

const router = express.Router();

// Apply for restaurant
router.post('/restaurants/application/:userEmail', applyRestaurant);

// Get all applications
router.get('/restaurants-applications', getAllRestaurantsApplications);

//get Approved Restaurant Data
router.get('/allApprovedRestaurant',allApprovedRestaurant)

// Update application status
router.patch('/update-status', updateStatus);

router.get('/restaurant/:email', getRestaurantData)


router.patch('/restaurantProfileUpdate/:email', updateRestaurantProfile);

module.exports = router;
