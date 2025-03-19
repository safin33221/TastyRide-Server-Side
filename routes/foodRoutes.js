const express = require('express');
const { addFood } = require('../controller/foodController');

const router = express.Router()

router.post("/foods", addFood)

module.exports = router
