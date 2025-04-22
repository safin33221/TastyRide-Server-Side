const mongoose = require('mongoose');
const User = require('../model/authModel');
const Restaurant = require('../model/restaurantModal');

const ObjectId = mongoose.Types.ObjectId;
// apply for rider
const applyRestaurant = async (req, res) => {
  try {
    const {
      name,
      businessName,
      type,
      description,
      address,
      pickup,
      mapPin,
      openDays,
      openTime,
      closeTime,
      logo,
      email,
    } = req.body;

    const { userEmail } = req.params;

    const user = await User.findOne({ email: userEmail });

    if (user?.restaurantStatus !== 'none') {
      return res
        .status(400)
        .json({ message: 'You already have an application!' });
    }

    const application = new Restaurant({
      userId: user?._id,
      name,
      businessName,
      type,
      description,
      address,
      pickup,
      mapPin,
      openDays,
      openTime,
      closeTime,
      status: 'pending',
      logo,
      email,
    });

    // console.log(application);
    // console.log(user);

    await application.save();

    // console.log(application);

    user.restaurantStatus = 'pending';
    await user.save();

    // console.log(application, user)

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id,
    });
  } catch (error) {
    // console.log("server error", error.message);

    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

//get all Approved Restaurant Data

const allApprovedRestaurant = async (req, res) => {
  try {
    const allApprovedRestaurant = await Restaurant.find({ status: 'approved' })
    res.status(200).send(allApprovedRestaurant)
  } catch (error) {
    res.status(500).send(`sever Error`, error)
    console.log(error);
  }
}

//get all riders
const getAllRestaurantsApplications = async (req, res) => {
  try {
    const result = await Restaurant.find();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'server error' });
  }
};

// Updated controller
const updateStatus = async (req, res) => {
  try {
    const { email, status } = req.body;
    console.log(email, status);
    if (email === undefined || status === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Email and status are required',
      });
    }
    const quary = { email };
    console.log(email, status);
    // 1. Update Restaurant status
    await Restaurant.findOneAndUpdate(quary, { $set: { status } });
    console.log('Restaurant status updated:', status);
    if (status === 'approved') {
      const userdoc = {
        $set: {
          restaurantStatus: status,
          role: 'restaurant',
        },
      };
      await User.findOneAndUpdate(quary, userdoc);
    } else {
      const quary = { email };
      const userdoc = {
        $set: {
          restaurantStatus: status,
        },
      };
      await User.findOneAndUpdate(quary, userdoc);
      res.status(200).json({
        massage: `Application ${status}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Application ${status}`,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

//get single restaurant data
const getRestaurantData = async (req, res) => {
  try {
    const { email } = req.params
    console.log(email);
    const query = { email }
    const user = await User.findOne(query)
    if (user.role !== 'restaurant') {
      return res.status(201).send({ message: 'Restaurant not Found !!' })
    }
    const restaurantData = await Restaurant.findOne(query)
    res.status(200).send(restaurantData)
  } catch (error) {
    res.status(500).send(`server Error: ${error}`)
  }
}

//Update Restaurant Data
const updateRestaurantProfile = async (req, res) => {
  const { email } = req.params

  const data = req.body

  const user = await User.findOne({ email })

  //check User
  if (!user) return res.send({ message: 'user not found' })
  // console.log(user);

  //Check user role>>
  if (user.role !== 'restaurant') return res.send({ message: 'Not a Restaurant' })

  const restaurant = await Restaurant.findOne({ email })
  if (!restaurant) {
    return res.status(404).send({ message: 'Restaurant not found' });
  }
  try {

    //update restaurant Details

    Object.assign(restaurant, data);

    await restaurant.save()
    res.status(200).json({ message: "Restaurant profile updated successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
    console.log(error);
  }

}


// get restaurant profile by email
const getRestaurantProfile = async (req, res) => {
  try {
    const email = req.params.email;



    // find restaurant by email
    const restaurant = await Restaurant.findOne({ email, status: 'approved' });

    // check if restaurant exists
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

  

    // return restaurant details
    res.status(200).json(restaurant);
  }
  catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}





module.exports = {
  getAllRestaurantsApplications,
  updateStatus,
  applyRestaurant,
  getRestaurantData,
  updateRestaurantProfile,
  allApprovedRestaurant,
  getRestaurantProfile
};
