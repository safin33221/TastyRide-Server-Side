const express = require('express');
const { addFood, getAllFood } = require('../controller/foodController');

const router = express.Router()
//add food
router.post("/foods", addFood)

// get all foods 
router.get("/foods", getAllFood)

module.exports = router
