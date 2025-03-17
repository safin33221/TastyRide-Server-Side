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
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User