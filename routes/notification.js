const express = require('express')
const { newNotification, getNotification } = require('../controller/notification')

const router = express.Router()


router.post('/notifications', newNotification)


router.get('/notifications/:email', getNotification)


module.exports = router