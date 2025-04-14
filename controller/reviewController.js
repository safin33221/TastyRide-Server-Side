const Review = require('../model/reviewModel');

const submitReview = async (req, res) => {
  try {
    const { userId, rating, review } = req.body;

    // Validate input
    if (!userId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newReview = await Review.create({
      userId,
      rating,
      review,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message,
    });
  }
};

// GET /api/reviews - Get all reviews with pagination
 const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).send({
      success: true,
      message: 'Reviews fetched successfully',
      data: reviews,
    });
  } catch (error) {
    console.error('Error in getAllReviews:', error);
    res.status(500).send({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
module.exports = { submitReview, getAllReviews  }