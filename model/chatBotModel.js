const mongoose = require('mongoose');

// Define schema to store website data
const chatBotSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

// Export the Mongoose model
const ChatBot = mongoose.model("Chatbot", chatBotSchema);

module.exports = ChatBot