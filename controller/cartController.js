const Cart = require("../model/cartModel");

const addToCart = async (req, res) => {
  const { food } = req.body;
  // console.log(food);
  try {
    const newCart = new Cart({
      name: food.foodName,
      image: food.image,
      price: food.price,
      userEmail: food.userEmail,
      foodOwner: food.addedBy,
      quantity: 1,
      totalPrice: food.price,
    });
    await newCart.save();
    res.status(200).send({ message: "Added to cart", data: newCart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getCartByEmail = async (req, res) => {
  const { email } = req.params;
  // console.log(email)
  try {
    const cartData = await Cart.find({ userEmail: email });
    if (!cartData)
      return res.status(404).send({ message: "No food added to cart" });
    res.status(200).send({ message: "Fetched cart", data: cartData });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteCartFood = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Cart.findByIdAndDelete({ _id: id });
    res.status(200).send({ message: "Deleted cart food", data: result });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { addToCart, getCartByEmail, deleteCartFood };
