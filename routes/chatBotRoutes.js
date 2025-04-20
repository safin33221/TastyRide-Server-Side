const express = require('express');
const { postChat } = require('../controller/chatBotController');

const router = express.Router()

router.post("/chat", postChat)

module.exports = router