const express = require('express');
const router = express.Router();
const { submitReview } = require('../controller/reviewController');

router.post('/reviews', submitReview);
router.get('/reviews', submitReview);

module.exports = router;
