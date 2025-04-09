const express = require('express');
const router = express.Router();
const { placeOrder} = require('../controller/orderController');

router.post('/orders', placeOrder);
// router.post('/init-payment', initPayment); // For SSLCommerz (to be implemented later)

module.exports = router;