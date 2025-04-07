const express = require('express');
const { addToCart, getCartByEmail, deleteCartFood } = require('../controller/cartController');

const router = express.Router()

router.post("/cart", addToCart)
router.get("/cart/:email", getCartByEmail)
router.delete("/cart/:id", deleteCartFood)

module.exports = router