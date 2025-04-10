const express = require('express')
const { newNotification } = require('../controller/notification')

const router = express.Router()


router.post('/notifications', newNotification)


module.exports = router