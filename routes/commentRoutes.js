const express = require('express');
const { addComment, getComments } = require('../controller/commentController');
const router = express.Router();

// get commetns for a specific food product
router.get("/:productId", getComments)

// post a comment
router.post("/", addComment)

module.exports = router