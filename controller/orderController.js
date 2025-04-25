const Order = require('../model/orderModel');
const moment = require('moment');

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
  console.log(status);

  try {
    const validStatuses = ['Pending', 'Cooking', 'On-the-Way', 'Delivered', 'Cancelled', 'Accepted'];
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
    // console.log("Fetching order:", orderId, "for user:", userEmail); // Log the fetch attempt
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

// get order overview of a restaurant
const getOrderOverview = async (req, res) => {
  try {
    const restaurantEmail = req.params.email;
    const thisMonth = moment().subtract(30, 'days').toDate();
    const oneWeek = moment().subtract(7, 'days').toDate();
    const selectedDay = req.query.date ? moment(req.query.date).startOf('day').toDate() : moment().startOf('day').toDate();
    const oneDay = moment(selectedDay).add(1, 'day').toDate();
    // console.log(selectedDay, oneDay)
  // get total orders of a restaurant
  const totalOrders = await Order.countDocuments({ restaurantEmail });

  // get total revenue of a restaurant
  const revenueResult = await Order.aggregate([
    {
      $match: { restaurantEmail },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {$sum: "$total_amount"},
      }
    }
  ])
  const totalRevenue =  revenueResult[0]?.totalRevenue || 0;

  // get total active orders of the restaurant
  const activeOrders = await Order.countDocuments(
    {restaurantEmail,
      status: {
        $in: ['Pending', 'Cooking', 'On-the-Way', 'Accepted'],
      }
    }
  )

  // get successfully delivered orders of the restaurant
  const deliveredOrders = await Order.countDocuments(
    {
      restaurantEmail,
      status: 'Delivered',
    }
  )

  // get total cancelled orders of the restaurant
  const cancelledOrders = await Order.countDocuments(
    {
      restaurantEmail,
      status: 'Cancelled',
    }
  )

  // order over last 30 days
  const orderOverOneMonth = await Order.aggregate([
    {
      $match: {
        restaurantEmail,
        createdAt: { $gte: thisMonth},
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
        count: { $sum: 1},
      }
    },
    {
      $sort: {_id: 1},
    }
  ])

  // order over last 7 days
  const orderOverOneWeek = await Order.aggregate([
    {
      $match: {
        restaurantEmail,
        createdAt: { $gte: oneWeek},
      
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
        },
        count: {$sum: 1},
      }
    },
    {
      $sort: {_id: 1},
    }
  ])

  // order in one day
  const orderOverOneDay = await Order.aggregate([
    {
      $match: {
        restaurantEmail,
        createdAt: { $gte: selectedDay, $lt: oneDay},
      }
    },
    {
      $group: {
        _id: {
          $hour: "$createdAt",
        },
        count: {$sum: 1}, 
      }
    },
    {
      $sort: {_id: 1},
    }
  ])

  // order status distribution
  const statusDistribution = await Order.aggregate([
    {
      $match: {restaurantEmail},
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1},
      }
    }
  ])

  res.status(200).send({
    metrics: {
      totalOrders,
      totalRevenue,
      activeOrders,
      deliveredOrders,
      cancelledOrders
    },
    charts: {
      orderOverOneMonth: orderOverOneMonth.map( items => ({
        date: items._id,
        count: items.count,
      })),
      orderOverOneWeek: orderOverOneWeek.map( items => ({
        date: items._id,
        count: items.count
      })),
      orderOverOneDay: orderOverOneDay.map(items =>({
        hour: items._id,
        count: items.count,
      })),
      statusDistribution: statusDistribution.map(items => ({
        status: items._id,
        count: items.count,
      }))
    }
  })
  }
  catch (error) {
    console.log(error.message)
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
}

module.exports = { placeOrder, getSellerOrders, updateOrderStatus, deleteOrder, getUserOrders, cancelOrder, getOrderById, getAllOrders, getOrderOverview };

