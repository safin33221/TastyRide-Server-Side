const Order = require('../model/orderModel');


const placeOrder = async (req, res) => {
  const {  info,
    cart,
    restaurantEmail,
    paymentMethod,
    total_amount,
    status,
    createdAt } = req.body;

  try {
    // if (!customerInfo || !foods || !total_amount || !paymentMethod) {
    //   return res.status(400).send({ success: false, message: "Missing required fields" });
    // }

    const order = new Order({
        info,
        cart,
        restaurantEmail,
        paymentMethod,
        total_amount,
        status,
        createdAt // Set the createdAt date to now
    });

    await order.save();

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
};

// // For SSLCommerz payment initiation (if needed later)
// const initPayment = async (req, res) => {
//   // Placeholder for SSLCommerz integration
//   // You’ll need to configure this with your SSLCommerz credentials
//   res.status(501).send({ success: false, message: "Payment gateway not implemented yet" });
// };

module.exports = { placeOrder };