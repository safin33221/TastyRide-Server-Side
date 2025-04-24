const Cart = require("../model/cartModel");

const addToCart = async (req, res) => {
  const { food } = req.body;
  // console.log(food);
  try {
    // console.log(food)
    const existingFood = await Cart.findOne({ name: food.foodName, userEmail: food.userEmail })
    if (existingFood) {
      existingFood.quantity += 1
      existingFood.totalPrice = existingFood.price * existingFood.quantity
      await existingFood.save()
      return res.status(200).send({ message: "Updated cart item", data: existingFood });
    }
    const newCart = new Cart({
      name: food.foodName,
      image: food.image,
      price: food.price,
      userEmail: food.userEmail,
      foodOwner: food.addedBy,
      quantity: 1,
      totalPrice: food.price,
      foodId: food._id
    });
    // console.log(newCart);
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

const handleQuantity = async (req, res) => {
  const { status, foodId } = req.body;
  const email = req.params.email
  console.log(status, foodId, email);

  const cartItem = await Cart.findOne({ foodId, userEmail: email })

  if (!cartItem) {
    return res.status(201).send({ message: "Foods Not found!" })

  }

  if (status === "increase") {
    cartItem.quantity += 1; // Increase quantity
  } else if (status === "decrease") {
    cartItem.quantity -= 1; // Decrease quantity
    if (cartItem.quantity <= 0) {
      // If quantity becomes 0 or less, remove the item from the cart

      return res.status(200).send({ message: "Invalid quantity" });
    }
  } else {
    return res.status(400).send({ message: "Invalid status value" });
  }

  // Update the total price
  cartItem.totalPrice = cartItem.price * cartItem.quantity;

  // // Apply discount based on total price

  // if (cartItem.totalPrice > 500) {
  //   cartItem.discount = cartItem.totalPrice * 0.05; // 5% discount
  // } else if (cartItem.totalPrice >= 1000) {
  //   cartItem.discount = cartItem.totalPrice * 0.10; // 10% discount
  // } else if (cartItem.totalPrice >= 1000) {
  //   cartItem.discount = cartItem.totalPrice * 0.20; // 10% discount
  // }

  // cartItem.totalPrice -= cartItem.discount; 

  // Save the updated cart item
  await cartItem.save();

  res.status(200).send({
    message: "Cart item updated",
    data: cartItem,
  
  });
}
const clearCart = async (req, res) => {
  const { email } = req.params
  try {
    const result = await Cart.deleteMany({ userEmail: email })
    res.status(200).send({ message: "Deleted cart food", data: result });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

module.exports = { addToCart, getCartByEmail, deleteCartFood, clearCart, handleQuantity };
