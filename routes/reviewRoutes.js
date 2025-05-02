const express = require('express');
const router = express.Router();
const {
  submitReview,
  getAllReviews,
  getReviewById
} = require('../controller/reviewController');

router.post('/reviews', submitReview);
router.get('/reviews', getAllReviews);
router.get('/singleOrderById/:id',getReviewById)

module.exports = router;
