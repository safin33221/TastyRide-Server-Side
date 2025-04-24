const express = require('express');
const { addToCart, getCartByEmail, deleteCartFood, clearCart,handleQuantity } = require('../controller/cartController');

const router = express.Router()

router.post("/cart", addToCart)
router.get("/cart/:email", getCartByEmail)
router.delete("/cart/:id", deleteCartFood)
router.delete("/clear-cart/:email", clearCart)
router.patch('/quantity/:email',handleQuantity)

module.exports = router