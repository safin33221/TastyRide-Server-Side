const { get } = require("mongoose");
const Food = require("./../model/foodModel");
const User = require("./../model/authModel");

const addFood = async (req, res) => {
  const {
    foodName,
    description,
    category,
    price,
    ingredients,
    availability,
    tags,
    image,
    addedBy,
  } = req.body;

  try {
    if (
      !foodName ||
      !description ||
      !category ||
      !price ||
      !ingredients ||
      !image ||
      !addedBy
    ) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const newFood = new Food({
      foodName,
      description,
      category,
      price: Number(price),
      ingredients: Array.isArray(ingredients)
        ? ingredients
        : ingredients.split(","),
      availability: availability || false,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(",") : [],
      image,
      addedBy,
    });

    await newFood.save();
    res
      .status(201)
      .send({
        success: true,
        message: "Food Created Successfully",
        data: newFood,
      }); // Added success: true
  } catch (error) {
    console.error("Error in addFood:", error);
    res
      .status(500)
      .send({ success: false, message: "Server Error", error: error.message }); // Added success: false
  }
};

const getAllFood = async (req, res) => {
  try {
    const foods = await Food.find();
    res
      .status(200)
      .send({
        success: true,
        message: "Food Fetched Successfully",
        data: foods,
      });
  } catch (error) {
    console.error("Error in getAllFood:", error);
    res
      .status(500)
      .send({ success: false, message: "Server Error", error: error.message });
  }
};

// get a single food with restaurant profile information
const getSingleFood = async (req, res) => {
  const id = req.params.id; // Food ID from URL
  try {
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // find restaurant profile
    const restaurant = await User.findOne({ email: food.addedBy, role: "restaurant" })
    .select("restaurantDetails")
    .lean()

    if(!restaurant || !restaurant.restaurantDetails) {
      return res.status(200).json({ food, message: "Restaurant not found" });
    }

    res.status(200).send({food, 
      restaurantName: restaurant.restaurantDetails.restaurantName, 
      restaurantProfile: restaurant.restaurantDetails.profilePhoto});
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getFoodByEmail = async (req, res) => {
  const  email  = req.params.email // Email passed as query parameter

  try {
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Email is required" });
    }
    const foods = await Food.find({ addedBy: email });
    res
      .status(200)
      .send({
        success: true,
        message: "Food Fetched Successfully",
        data: foods,
      });
  } catch (error) {
    console.error("Error in getFoodByEmail:", error);
    res
      .status(500)
      .send({ success: false, message: "Server Error", error: error.message });
  }
};


const updateFood = async (req, res) => {
  const { id } = req.params; // Food ID from URL
  const {
    foodName,
    description,
    category,
    price,
    ingredients,
    availability,
    tags,
    image,
  } = req.body;

  try {
    const updatedFood = await Food.findByIdAndUpdate(
      id,
      {
        foodName,
        description,
        category,
        price: Number(price),
        ingredients: Array.isArray(ingredients)
          ? ingredients
          : ingredients.split(","),
        availability,
        tags: Array.isArray(tags) ? tags : tags ? tags.split(",") : [],
        image,
      },
      { new: true, runValidators: true } // Return updated document and validate
    );

    if (!updatedFood) {
      return res
        .status(404)
        .send({ success: false, message: "Food item not found" });
    }

    res
      .status(200)
      .send({
        success: true,
        message: "Food Updated Successfully",
        data: updatedFood,
      });
  } catch (error) {
    console.error("Error in updateFood:", error);
    res
      .status(500)
      .send({ success: false, message: "Server Error", error: error.message });
  }
};

const deleteFood = async (req, res) => {
  const { id } = req.params; // Food ID from URL

  try {
    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res
        .status(404)
        .send({ success: false, message: "Food item not found" });
    }

    res
      .status(200)
      .send({ success: true, message: "Food Deleted Successfully" });
  } catch (error) {
    console.error("Error in deleteFood:", error);
    res
      .status(500)
      .send({ success: false, message: "Server Error", error: error.message });
  }
};

const foodReaction = async (req, res) => {
  const { id } = req.params; // Food ID from URL
  const { reaction, userId } = req.body;

  try {
    const food = await Food.findById(id);

    if (!food) {
      return res
        .status(404)
        .send({ success: false, message: "Food item not found" });
    }

    if (reaction === "like") {
      if (food.likes.includes(userId)) {
        food.likes.pull(userId); //user already liked the food, so removed the like
      } else {
        food.likes.push(userId); //user liked the food
        food.dislikes.pull(userId); //if user liked the food, then remove the dislike
      }
    }
    if (reaction === "dislike") {
      if (food.dislikes.includes(userId)) {
        food.dislikes.pull(userId); //user already disliked the food, so removed the dislike
      } else {
        food.dislikes.push(userId); //user disliked the food
        food.likes.pull(userId); //if user disliked the food, then remove the like
      }
    }

    await food.save();
    res
      .status(200)
      .send({ likes: food.likes.length, dislikes: food.dislikes.length })
  } catch (error) {
    console.error("Error in foodReaction:", error);
    res
      .status(500)
      .send({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  addFood,
  getAllFood,
  getFoodByEmail,
  updateFood,
  deleteFood,
  getSingleFood,
  foodReaction
};
