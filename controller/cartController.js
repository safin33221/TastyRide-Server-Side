const Cart = require("../model/cartModel");

const addToCart = async (req, res) => {
  const food = req.body;
  console.log(food);
  try {
    const newCart = new Cart({
      food,
    });
    await newCart.save();
    res.status(200).send({ message: "Added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getCartByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const cartData = await Cart.find({ userEmail: email });
    if (!cartData)
      return res.status(404).send({ message: "No food added to cart" });
    res.status(200).send({ message: "Fetched cart", data: cartData });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { addToCart, getCartByEmail };
