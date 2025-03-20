
const Food = require('./../model/foodModel');

const addFood = async (req, res) => {
  const { foodName, description, category, price, ingredients, availability, tags, image, addedBy } = req.body;

  try {
    if (!foodName || !description || !category || !price || !ingredients || !image || !addedBy) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const newFood = new Food({
      foodName,
      description,
      category,
      price: Number(price),
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(","),
      availability: availability || false,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",") : []),
      image,
      addedBy,
    });

    await newFood.save();
    res.status(201).send({ success: true, message: "Food Created Successfully", data: newFood }); // Added success: true
  } catch (error) {
    console.error("Error in addFood:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message }); // Added success: false
  }
};

const getAllFood = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).send({ success: true, message: "Food Fetched Successfully", data: foods });
  } catch (error) {
    console.error("Error in getAllFood:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = { addFood, getAllFood };