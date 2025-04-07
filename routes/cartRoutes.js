const express = require('express');
const { addToCart, getCartByEmail } = require('../controller/cartController');

const router = express.Router()

router.post("/cart", addToCart)
router.get("/cart", getCartByEmail)

module.exports = router