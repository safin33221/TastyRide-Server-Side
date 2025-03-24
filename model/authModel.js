const mongoose = require('mongoose')


//Restaurant Details Sub-Schema
const restaurantDetailsSchema = new mongoose.Schema({
    restaurantName: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String
    },
    profilePhoto: {
        type: String
    },
    coverPhoto: {
        type: String
    },
    description: {
        type: String
    },
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    photo: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        required: false 
    },
    address: {
        type: String,
        required: false 
    },
    date: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'restaurant'],
        default: 'customer', 
    },
    restaurantDetails: {
        type: restaurantDetailsSchema, 
        default: null
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User