const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['fast-food', 'buffet', 'fine-dining', 'cafe', 'other'],
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  coverPhoto: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pickup: {
    type: Boolean,
    required: true,
  },

  mapPin: {
    type: String, // or you can use an object { lat: Number, lng: Number }
    required: true,
  },
  openDays: [
    {
      type: String,
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  openTime: {
    type: String,
    required: true,
  },
  closeTime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  followers: {
    type: [String], // array of user emails who follow this restaurant
    default: [],
  },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
