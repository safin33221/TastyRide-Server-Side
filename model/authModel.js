const mongoose = require('mongoose')


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
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User