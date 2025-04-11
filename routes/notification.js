const express = require('express')
const { newNotification, getNotification, deleteNotification } = require('../controller/notification')

const router = express.Router()


router.post('/notifications', newNotification)


router.get('/notifications/:email', getNotification)
router.delete('/delete-notification/:email', deleteNotification)


module.exports = router