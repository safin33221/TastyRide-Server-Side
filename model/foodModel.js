

const { default: mongoose } = require("mongoose");

const foodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ingredients: {
        type: [String], // Ensures ingredients are stored as an array of strings
        required: true
    },
    availability: {
        type: Boolean,
        required: true,
        default: true // Optional: Default to available
    },
    tags: {
        type: [String], // Array of tags for categorization
        default: [] // Optional: Default to an empty array
    },
    image: {
        type: String,
        required: true
    },
    addedBy: {
        type: String, // Stores the user's email
        required: true,
        trim: true,
        lowercase: true
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
