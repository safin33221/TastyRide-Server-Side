const express = require('express');
const { addFood, getAllFood, getFoodByEmail, updateFood, deleteFood, getSingleFood, foodReaction } = require('../controller/foodController');

const router = express.Router()
//add food
router.post("/foods", addFood)

// get all foods 
router.get("/foods", getAllFood)

// get a signle food by id
router.get("/foods/:id", getSingleFood);

// food reaction
router.post("/foods/reaction/:id", foodReaction);

router.get('/food/by-email/:email', getFoodByEmail); // New route for fetching by email

router.put('/foods/:id', updateFood); // New route for updating

router.delete('/foods/:id', deleteFood); // New route for deleting

module.exports = router
