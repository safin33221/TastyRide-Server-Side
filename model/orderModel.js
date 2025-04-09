const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  info: {
    type: Object,
    required: true
  },
  cart: {
    type: Array,
    required: true
  },
  restaurantEmail: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
   
  },
  total_amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
    }
});
module.exports = mongoose.model('Order', orderSchema);