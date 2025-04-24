
const express = require('express');
const {
  applyRestaurant,
  getAllRestaurantsApplications,
  updateStatus,
  getRestaurantData,
  updateRestaurantProfile,
  allApprovedRestaurant,
  getApprovedRestaurantsFlat,
  getRestaurantProfile,
  followRestaurant,
  getRestaurantsByCity,
} = require('../controller/restaurantController');

const router = express.Router();

// Apply for restaurant
router.post('/restaurants/application/:userEmail', applyRestaurant);

// Get all applications
router.get('/restaurants-applications', getAllRestaurantsApplications);

// Get approved restaurants grouped by city
router.get('/allApprovedRestaurant', allApprovedRestaurant);

// Get approved restaurants as a flat list
router.get('/approvedRestaurants', getApprovedRestaurantsFlat);

// Get restaurants by city
router.get('/restaurants/city/:cityName', getRestaurantsByCity);

// Update application status
router.patch('/update-status', updateStatus);

// Get single restaurant
router.get('/restaurant/:email', getRestaurantData);

// Update restaurant data
router.patch('/restaurantProfileUpdate/:email', updateRestaurantProfile);

// Get restaurant profile by email
router.get('/SingleRestaurantProfile/:email', getRestaurantProfile);

// Follow or unfollow a restaurant
router.patch('/restaurant/follow', followRestaurant);

module.exports = router;