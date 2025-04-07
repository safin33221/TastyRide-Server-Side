const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./utils/db");

const app = express();
const port = process.env.PORT || 8000;

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const adRoutes = require("./routes/adRoutes");
const chatBotRoutes = require("./routes/chatBotRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Mongoose
connectDB();
app.use("/api", authRoutes);
app.use("/api", foodRoutes);
app.use("/api", adRoutes);
app.use("/api", chatBotRoutes);
app.use("/api", cartRoutes);



// Root route
app.get("/", async (req, res) => {
  res.send("Tasty food application running successfully with Gemini AI!");
});

app.listen(port, () => {
  console.log(`TastyRide running on ${port}`);
});
