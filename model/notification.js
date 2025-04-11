const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    to_email: {
        type: String,
        require: true
    },
    from_email: {
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
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        default: null
    },
    createdAt: {
        type: Date,
        default: new Date()
    }

})

const notification = mongoose.model('notification', notificationSchema)
module.exports = notification