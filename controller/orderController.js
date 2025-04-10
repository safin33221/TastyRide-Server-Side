// const Order = require('../model/orderModel');


// const placeOrder = async (req, res) => {
//   const {  info,
//     cart,
//     restaurantEmail,
//     paymentMethod,
//     total_amount,
//     status,
//     createdAt } = req.body;

//   try {
//     // if (!customerInfo || !foods || !total_amount || !paymentMethod) {
//     //   return res.status(400).send({ success: false, message: "Missing required fields" });
//     // }

//     const order = new Order({
//         info,
//         cart,
//         restaurantEmail,
//         paymentMethod,
//         total_amount,
//         status,
//         createdAt // Set the createdAt date to now
//     });

//     await order.save();

//     res.status(201).send({
//       success: true,
//       message: "Order placed successfully",
//       data: order,
//     });
//   } catch (error) {
//     console.error("Error in placeOrder:", error);
//     res.status(500).send({ success: false, message: "Server Error", error: error.message });
//   }
// };

// // // For SSLCommerz payment initiation (if needed later)
// // const initPayment = async (req, res) => {
// //   // Placeholder for SSLCommerz integration
// //   // You’ll need to configure this with your SSLCommerz credentials
// //   res.status(501).send({ success: false, message: "Payment gateway not implemented yet" });
// // };

// module.exports = { placeOrder };
const Order = require('../model/orderModel');

// Place Order
const placeOrder = async (req, res) => {
  const { info, cart, restaurantEmail, paymentMethod, total_amount, status, createdAt } = req.body;

  try {
    const order = new Order({
      info,
      cart,
      restaurantEmail,
      paymentMethod,
      total_amount,
      status: status || 'Pending', // Default to 'Pending'
      createdAt: createdAt || Date.now(),
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

// Get Orders by Restaurant Email
const getSellerOrders = async (req, res) => {
  const { email } = req.params;

  try {
    const orders = await Order.find({ restaurantEmail: email });
    res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error in getSellerOrders:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = ['Pending', 'Cooking', 'On the Way', 'Delivered']; // Updated statuses
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, createdAt: Date.now() }, // Using createdAt as per your schema
      { new: true }
    );

    if (!order) {
      return res.status(404).send({ success: false, message: "Order not found" });
    }

    res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).send({ success: false, message: "Order not found" });
    }

    res.status(200).send({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
};

// Get Orders by User Email
const getUserOrders = async (req, res) => {
  const { email } = req.params;

  try {
    const orders = await Order.find({ "info.cus_email": email });
    res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
};

// Cancel Order
// This function allows a user to cancel their order if it is in "Pending" status

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const { userEmail } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({ success: false, message: "Order not found" });
    }

    // Check if the user is the owner of the order
    
    if (order.info.cus_email !== userEmail) {
      return res.status(403).send({ success: false, message: "Unauthorized: You can only cancel your own orders" });
    }

    // Only allow cancellation if the status is "Pending"
    if (order.status !== "Pending") {
      return res.status(400).send({ success: false, message: "Order can only be cancelled if it is in Pending status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "Cancelled", createdAt: Date.now() },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Order cancelled successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = { placeOrder, getSellerOrders, updateOrderStatus, deleteOrder, getUserOrders, cancelOrder };