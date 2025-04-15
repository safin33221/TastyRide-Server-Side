const express = require('express');

const { applyRider, getAllRidersApplications, updateStatus } = require('../controller/riderController')

const router = express.Router()

// Apply for rider
router.post("/rider/application/:userEmail", applyRider);

router.get('/riders-applications', getAllRidersApplications)
router.patch('/update-applications-status', updateStatus)

module.exports = router;