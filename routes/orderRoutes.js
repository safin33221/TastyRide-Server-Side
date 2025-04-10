// const express = require('express');
// const router = express.Router();
// const { placeOrder} = require('../controller/orderController');

// router.post('/orders', placeOrder);
// // router.post('/init-payment', initPayment); // For SSLCommerz (to be implemented later)

// module.exports = router;
const express = require('express');
const router = express.Router();
const { placeOrder, getSellerOrders, updateOrderStatus, deleteOrder, getUserOrders, cancelOrder } = require('../controller/orderController');

router.post('/orders', placeOrder);
router.get('/orders/seller/:email', getSellerOrders);
router.put('/orders/:orderId', updateOrderStatus);
router.delete('/orders/:orderId', deleteOrder);
router.get('/orders/user/:email', getUserOrders); 
router.put('/orders/cancel/:orderId', cancelOrder); 

module.exports = router;