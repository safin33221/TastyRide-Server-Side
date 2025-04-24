const express = require('express');
const {
  applyRestaurant,
  getAllRestaurentsApplications,
  updateStatus,
} = require('../controller/restaurantController');

const router = express.Router();

// Apply for restaurant
router.post('/restaurants/application/:userEmail', applyRestaurant);

// Get all applications
router.get('/restaurants-applications', getAllRestaurentsApplications);

// Update application status
router.patch('/update-status', updateStatus);

module.exports = router;
