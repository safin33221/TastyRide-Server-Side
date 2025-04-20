const express = require('express');
const router = express.Router();
const {
  submitReview,
  getAllReviews,
} = require('../controller/reviewController');

router.post('/reviews', submitReview);
router.get('/reviews', getAllReviews);

module.exports = router;
