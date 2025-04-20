const mongoose = require('mongoose')



const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const connectDB = async() => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "tastyRideDB"
    });
    console.log("MongoDB successfully Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
}

module.exports = connectDB
