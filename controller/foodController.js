
const { get } = require('mongoose');
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

const getFoodByEmail = async (req, res) => {
  const { email } = req.query; // Email passed as query parameter

  try {
    if (!email) {
      return res.status(400).send({ success: false, message: "Email is required" });
    }
    const foods = await Food.find({ addedBy: email });
    res.status(200).send({ success: true, message: "Food Fetched Successfully", data: foods });
  } catch (error) {
    console.error("Error in getFoodByEmail:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
};

const updateFood = async (req, res) => {
  const { id } = req.params; // Food ID from URL
  const { foodName, description, category, price, ingredients, availability, tags, image } = req.body;

  try {
    const updatedFood = await Food.findByIdAndUpdate(
      id,
      {
        foodName,
        description,
        category,
        price: Number(price),
        ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(","),
        availability,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(",") : []),
        image,
      },
      { new: true, runValidators: true } // Return updated document and validate
    );

    if (!updatedFood) {
      return res.status(404).send({ success: false, message: "Food item not found" });
    }

    res.status(200).send({ success: true, message: "Food Updated Successfully", data: updatedFood });
  } catch (error) {
    console.error("Error in updateFood:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
};

const deleteFood = async (req, res) => {
  const { id } = req.params; // Food ID from URL

  try {
    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).send({ success: false, message: "Food item not found" });
    }

    res.status(200).send({ success: true, message: "Food Deleted Successfully" });
  } catch (error) {
    console.error("Error in deleteFood:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = { addFood, getAllFood, getFoodByEmail, updateFood, deleteFood };