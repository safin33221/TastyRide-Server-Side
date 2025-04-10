const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    cus_email: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true,
    },
    read: {
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: new Date()
    }

})

const notification = mongoose.model('notification', notificationSchema)
module.exports = notification