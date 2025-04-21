const express = require('express');

const { applyRider, getAllRidersApplications, updateStatus, acceptedByRider } = require('../controller/riderController')

const router = express.Router()

// Apply for rider
router.post("/rider/application/:userEmail", applyRider);

router.get('/riders-applications', getAllRidersApplications)
router.patch('/update-applications-status', updateStatus)
router.patch("/accepted-rider/:orderId", acceptedByRider)
module.exports = router;