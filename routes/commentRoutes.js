const express = require('express');
const { addComment, getComments } = require('../controller/commentController');
const router = express.Router();

// get commetns for a specific food product
router.get("/comments/:productId", getComments)

// post a comment
router.post("/comments", addComment)

module.exports = router