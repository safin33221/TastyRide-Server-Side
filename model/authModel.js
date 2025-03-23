const mongoose = require('mongoose')


//Restaurant Details Sub-Schema
const restaurantDetailsSchema = new mongoose.Schema({
    restaurantName: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    location: {
        type: String
    },
    profilePhoto: {
        type: String
    },
    coverPhoto: {
        type: String
    },
    Description: {
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