





const Order = require('../model/orderModel');


const getAllOrders = async (req, res) => {
  try {
    const results = await Order.find()
    res.status(200).send(results)
  } catch (error) {
    return res.status(500).send({ message: 'Sever error', error })
  }
}

// Place Order
const placeOrder = async (req, res) => {
  const { info, cart, restaurantEmail, paymentMethod, total_amount, status, createdAt } = req.body;

  try {
    console.log("Received Order Data:", req.body); // Log the incoming data

    // Validate required fields
    if (!info || !cart || !restaurantEmail || !total_amount) {
      return res.status(400).send({ success: false, message: "Missing required fields" });
    }

    const order = new Order({
      info,
      cart,
      restaurantEmail,
      paymentMethod,
      total_amount,
      status: status || 'Pending',
      createdAt: createdAt || Date.now(),
    });

    const savedOrder = await order.save();
    console.log("Saved Order:", savedOrder); // Log the saved order

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      data: savedOrder,
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
    const validStatuses = ['Pending', 'Cooking', 'On the Way', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, createdAt: Date.now() },
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
const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const { userEmail } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({ success: false, message: "Order not found" });
    }

    if (order.info.cus_email !== userEmail) {
      return res.status(403).send({ success: false, message: "Unauthorized: You can only cancel your own orders" });
    }

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

// Get Order by ID
const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const { userEmail } = req.query;

  try {
    console.log("Fetching order:", orderId, "for user:", userEmail); // Log the fetch attempt
    const order = await Order.findById(orderId);

    if (!order) {
      console.log("Order not found:", orderId); // Log if order isn't found
      return res.status(404).send({ success: false, message: "Order not found" });
    }

    if (order.info.cus_email !== userEmail) {
      return res.status(403).send({ success: false, message: "Unauthorized: You are not allowed to view this order" });
    }

    res.status(200).send({ success: true, data: order });
  } catch (error) {
    console.error("Error in getOrderById:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = { placeOrder, getSellerOrders, updateOrderStatus, deleteOrder, getUserOrders, cancelOrder, getOrderById, getAllOrders };

