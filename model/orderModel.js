

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  info: {
    type: {
      cus_name: { type: String, required: true },
      cus_email: { type: String, required: true },
      cus_phone: { type: String, required: true },
      cus_add1: { type: String, required: true },
      cus_city: { type: String, required: true },
      cus_country: { type: String, required: true },
      total_amount: { type: Number, required: true },
    },
    required: true,
  },
  cart: {
    type: Array,
    required: true,
  },
  restaurantEmail: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  transaction_id: {
    type: String

  },
  status: {
    type: String,
    enum: ['Pending', 'Cooking', 'On-the-Way', 'Delivered', 'Cancelled', 'Accepted'],
    default: 'Pending',
  },
  acceptedBy: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);