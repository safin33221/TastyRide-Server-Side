const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatBot = require("../model/chatBotModel");
const scrapeWebsite = require("../utils/scrapper");
const dataset = require("../utils/trainingData.json")


// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyA9Sfe6W_uj6w9bNGAQxPFMrkMIhU3OMfg");

// custom response 
const getDatasetResponse = (qs) => {
  for(let entry of dataset){
    if(qs?.toLowerCase().includes(entry.question?.toLowerCase())){
      return entry.answer
    }
  }
  return null
}

// Chatbot API Route
const postChat = async (req, res) => {
  try {
    const { message} = req.body;
    const websiteUrl = "https://tastyride-cd1a3.web.app/"

    console.log(message)
    // check dataset for custom response 
    const datasetReply = getDatasetResponse(message)
    if(datasetReply){
      return res.json({reply: datasetReply})
    }

    // Check if website content is already in the database
    let websiteData = await ChatBot.findOne({ url: websiteUrl });

    if (!websiteData) {
      // Scrape and store data if not found
      const scrapedContent = await scrapeWebsite(websiteUrl);
      if (!scrapedContent)
        return res.status(500).json({ error: "Failed to scrape website" });

      websiteData = await ChatBot.create({
        url: websiteUrl,
        content: scrapedContent,
      });
    }

    // Send scraped data to Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Choose the model version you need
    const chat = model.startChat(); // Start a chat session

    // Send the message to the chat session
    const result = await chat.sendMessage(
      `Website content:\n${websiteData.content}\n\nUser: ${message}`
    );

    // Return the response to the user
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


module.exports = {postChat}