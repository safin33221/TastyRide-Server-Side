const express = require('express');
const {applyRider} = require('../controller/riderController')

const router = express.Router()

// Apply for rider
router.post("/rider/application/:email", applyRider);

module.exports = router;