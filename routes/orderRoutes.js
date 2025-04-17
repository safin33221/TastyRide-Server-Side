
const express = require('express');
const router = express.Router();
const { placeOrder, getSellerOrders, updateOrderStatus, deleteOrder, getUserOrders, cancelOrder, getAllOrders, getOrderById, acceptedByRider } = require('../controller/orderController');

router.post('/orders', placeOrder);
router.get('/orders/seller/:email', getSellerOrders);
router.put('/orders/:orderId', updateOrderStatus);
router.delete('/orders/:orderId', deleteOrder);
router.get('/orders/user/:email', getUserOrders); 
router.put('/orders/cancel/:orderId', cancelOrder); 
router.get('/orders/:orderId', getOrderById);
router.get('/orders/user/:email', getUserOrders);
router.put('/orders/cancel/:orderId', cancelOrder);
router.get('/allOrders', getAllOrders)
router.patch("/accepted-rider/:orderId", acceptedByRider)

module.exports = router;