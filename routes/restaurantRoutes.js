const express = require('express');
const {
  applyRestaurant,
  getAllRestaurantsApplications,
  updateStatus,
  getRestaurantData
} = require('../controller/restaurantController');

const router = express.Router();

// Apply for restaurant
router.post('/restaurants/application/:userEmail', applyRestaurant);

// Get all applications
router.get('/restaurants-applications', getAllRestaurantsApplications);

// Update application status
router.patch('/update-status', updateStatus);

router.get('/restaurant/:email', getRestaurantData)

module.exports = router;
