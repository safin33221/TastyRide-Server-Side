const Food = require('./../model/foodModel');

const addFood = async (req, res) => {
  const { foodName, foodImg, price, review } = req.body;
  try {
    //Save New food in DB
    const newFood = new Food({
      foodName,
      foodImg,
      price,
      review,
    });
    await newFood.save();
    res.status(201).send({ message: "Food Created Successfully", data: newFood });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
};


const getAllFood = async (req, res) => {
  try {
    const foods = await Food.find()
    res.status(201).send({ message: "Food Fetched Successfully", data: foods });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
}

module.exports = {addFood, getAllFood}