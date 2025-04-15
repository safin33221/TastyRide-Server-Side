const express = require('express');

const { applyRider, getAllRidersApplications } = require('../controller/riderController')

const router = express.Router()

// Apply for rider
router.post("/rider/application/:userEmail", applyRider);

router.get('/riders-applications',getAllRidersApplications)

module.exports = router;