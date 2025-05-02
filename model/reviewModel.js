const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // user email
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userPhoto: { type: String },
  restaurantEmail: { type: String },
  orderId: { type: String }
});

module.exports = mongoose.model('Review', reviewSchema);
