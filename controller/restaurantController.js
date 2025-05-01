

const mongoose = require('mongoose');
const User = require('../model/authModel');
const Restaurant = require('../model/restaurantModal');

const ObjectId = mongoose.Types.ObjectId;

// City images (for allApprovedRestaurant)
const cityImages = {
  Dhaka: "https://i.ibb.co.com/MFFM5Cb/dhaka.jpg",
  Chittagong: "https://i.ibb.co.com/WvzmR6gc/chattogram.jpg",
  Khulna: "https://i.ibb.co.com/vgTs2FB/khulna.jpg",
  Sylhet: "https://i.ibb.co.com/JWPpnmnH/sylhet.jpg",
  Narayanganj: "https://i.ibb.co.com/Xkj6GNJX/nayangonj.jpg",
  Rajshahi: "https://i.ibb.co.com/fVq9b6d5/rajshai.jpg",
  Mymensingh: "https://i.ibb.co.com/5g69bqT1/Mymensingh.jpg",
  Bogra: "https://i.ibb.co.com/Y65YWFc/Bogra.webp",
  Cumilla: "https://i.ibb.co.com/1fZXkXPm/Cumilla.jpg",
  Tangail: "https://i.ibb.co.com/SwN5pZhn/Tangail.jpg",
  Barisal: "https://i.ibb.co.com/yB70Dj52/barisal.jpg",
  Gazipur: "https://i.ibb.co.com/Lz1qZXTj/Gazipur.webp",
  CoxsBazar: "https://i.ibb.co.com/4RccVFdV/Cox-s-Bazar.jpg",
  Rangpur: "https://i.ibb.co.com/Z1LcnJ0G/rangpur.jpg",
};

// Apply for restaurant
const applyRestaurant = async (req, res) => {
  try {
    const {
      name,
      businessName,
      type,
      description,
      city,
      district,
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
      city,
      district,
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

    await application.save();

    user.restaurantStatus = 'pending';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get all restaurant applications
const getAllRestaurantsApplications = async (req, res) => {
  try {
    const result = await Restaurant.find();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'server error' });
  }
};

// Get all approved restaurants grouped by city (for DeliveryCities)
const allApprovedRestaurant = async (req, res) => {
  try {
    const allApprovedRestaurants = await Restaurant.find({ status: 'approved' });

    // Group restaurants by city
    const cityMap = {};
    allApprovedRestaurants.forEach((restaurant) => {
      const city = restaurant.city;
      if (!cityMap[city]) {
        cityMap[city] = {
          name: city,
          restaurants: 0,
          image: cityImages[city] || "https://i.ibb.co.com/default-placeholder.jpg",
        };
      }
      cityMap[city].restaurants += 1;
    });

    const cityData = Object.values(cityMap).sort((a, b) => b.restaurants - a.restaurants);

    res.status(200).json({
      success: true,
      data: cityData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get all approved restaurants as a flat list (for ExploreRestaurant)
const getApprovedRestaurantsFlat = async (req, res) => {
  try {
    const approvedRestaurants = await Restaurant.find({ status: 'approved' });
    res.status(200).json({
      success: true,
      data: approvedRestaurants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get restaurants by city (for CityRestaurants)
const getRestaurantsByCity = async (req, res) => {
  try {
    const { cityName } = req.params;
    const restaurants = await Restaurant.find({
      city: new RegExp(`^${cityName}$`, 'i'), // Case-insensitive match
      status: 'approved'
    });

    if (!restaurants.length) {
      return res.status(404).json({
        success: false,
        message: `No restaurants found in ${cityName}`,
      });
    }

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update application status
const updateStatus = async (req, res) => {
  try {
    const { email, status } = req.body;
    if (email === undefined || status === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Email and status are required',
      });
    }
    const query = { email };
    await Restaurant.findOneAndUpdate(query, { $set: { status } });
    if (status === 'approved') {
      const userDoc = {
        $set: {
          restaurantStatus: status,
          role: 'restaurant',
        },
      };
      await User.findOneAndUpdate(query, userDoc);
    } else {
      const userDoc = {
        $set: {
          restaurantStatus: status,
        },
      };
      await User.findOneAndUpdate(query, userDoc);
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

// Get single restaurant data
const getRestaurantData = async (req, res) => {
  try {
    const { email } = req.params;
    const query = { email };
    const user = await User.findOne(query);
    if (user.role !== 'restaurant') {
      return res.status(201).send({ message: 'Restaurant not Found !!' });
    }
    const restaurantData = await Restaurant.findOne(query);
    res.status(200).send(restaurantData);
  } catch (error) {
    res.status(500).send(`server Error: ${error}`);
  }
};

// Update restaurant data
const updateRestaurantProfile = async (req, res) => {
  const { email } = req.params;
  const data = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.send({ message: 'user not found' });

  if (user.role !== 'restaurant')
    return res.send({ message: 'Not a Restaurant' });

  const restaurant = await Restaurant.findOne({ email });
  if (!restaurant) {
    return res.status(404).send({ message: 'Restaurant not found' });
  }
  try {
    Object.assign(restaurant, data);
    await restaurant.save();
    res
      .status(200)
      .json({ message: 'Restaurant profile updated successfully', restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
    console.log(error);
  }
};

// Get restaurant profile by email
const getRestaurantProfile = async (req, res) => {
  try {
    const email = req.params.email;

    const restaurant = await Restaurant.findOne({ email, status: 'approved' });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Follow or unfollow a restaurant
const followRestaurant = async (req, res) => {
  const { userEmail, restaurantEmail } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ email: restaurantEmail });
    const user = await User.findOne({ email: userEmail });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (restaurant.followers.includes(userEmail)) {
      restaurant.followers.pull(userEmail);
      await restaurant.save();
      user.followingRestaurant.pull(restaurant._id);
      await user.save();
      return res.status(200).json({
        message: 'Unfollowed the restaurant successfully',
        isFollowing: false,
      });
    } else {
      restaurant.followers.push(userEmail);
      await restaurant.save();
      user.followingRestaurant.push(restaurant._id);
      await user.save();
      return res.status(200).json({
        message: 'Followed the restaurant successfully',
        isFollowing: true,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
    console.log(error.message)
  }
};

const getRestaurantByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    // Search for restaurants where city, district, or address matches the location
    const restaurants = await Restaurant.find({
      $or: [
        { city: new RegExp(location, 'i') }, // Case-insensitive match for city
        { district: new RegExp(location, 'i') }, // Case-insensitive match for district
        { address: new RegExp(location, 'i') } // Case-insensitive match for address
      ],
      status: 'approved' // Only approved restaurants
    });

    if (!restaurants.length) {
      return res.status(404).json({
        success: false,
        message: `No restaurants found for location: ${location}`,
      });
    }

    res.status(200).send(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
      }
};


module.exports = {
  applyRestaurant,
  getAllRestaurantsApplications,
  allApprovedRestaurant,
  getApprovedRestaurantsFlat, // New controller
  getRestaurantsByCity,
  updateStatus,
  getRestaurantData,
  updateRestaurantProfile,
  getRestaurantProfile,
  followRestaurant,
  getRestaurantByLocation
};