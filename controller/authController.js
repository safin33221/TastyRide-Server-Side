const User = require("../model/authModel");
const bcrypt = require('bcrypt')
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 0.1 * 60 * 1000; // 15 minutes


const registerUser = async (req, res) => {
  const { username, email, photo, role, password } = req.body;
  try {
    //Check Existing User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({ message: "User already exist" });
    }

    //Save New user in DB
    const newUser = new User({
      username,
      photo,
      email,
      password,
      role
    });
    console.log(newUser);
    await newUser.save();
    res.status(201).send({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).send({ message: "server Error" });
  }
};



const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};


// get user role by email
const getUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// get restaurant profile by email
const getRestaurantProfile = async (req, res) => {
  try {
    const email = req.params.email;

    // check if email is valid
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // find restaurant by email
    const restaurant = await User.findOne({ email, role: 'restaurant' });

    // check if restaurant exists
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // check if restaurant details are available
    if (!restaurant.restaurantDetails) {
      return res.status(404).json({ message: "Restaurant profile does not set up yet" });
    }

    // return restaurant details
    res.status(200).json(restaurant.restaurantDetails);
  }
  catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}


const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role input (optional but recommended)
    const validRoles = ["admin", "restaurant", "customer"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Update the user and return the updated document
    const updatedUser = await User.updateOne(
      { _id: id },
      { role },
      { new: true } // Note: `new: true` is for findOneAndUpdate, not updateOne; see alternative below
    );

    // Since updateOne doesn’t return the document, fetch it afterward if needed
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success with modifiedCount for frontend to interpret
    res.status(200).json({
      message: "User role updated successfully",
      modifiedCount: updatedUser.modifiedCount,
      user, // Optionally return the updated user
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.deleteOne({ _id: id });

    if (deletedUser.deletedCount > 0) {
      res.status(200).json({
        message: "User deleted successfully",
        deletedCount: deletedUser.deletedCount,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// update user profile
const updateUserProfile = async (req, res) => {
  const { email } = req.params;
  const { username, photo, phone, address } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Find user by email
      { username, photo, phone, address }, // Update these fields
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", updatedUser });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }

}

//get Restaurant Profile

const allRestaurants = async (req, res) => {
  const restaurants = await User.find({ role: 'restaurant' })
  res.status(200).send(restaurants)
}

//Update Restarunt Profile
const updateResturantProfile = async (req, res) => {
  const email = req.params.email

  const data = req.body

  const user = await User.findOne({ email })

  //check User
  if (!user) return res.send({ message: 'user not found' })

  //Check user role>>
  if (user.role != 'restaurant') return res.send({ message: 'only restaurant can update restaurant details' })

  try {

    //update resturant Details

    user.restaurantDetails = {
      ...user.restaurantDetails,
      ...data
    }

    await user.save()
    res.status(200).json({ message: "Restaurant profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }

}


const logInAttempts = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(email, password);
    const user = await User.findOne({ email })

    //Find user
    if (!user) {
      return res.status(400).send({ message: 'user not found' })
    }

    //check  if user is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {

      return res.status(403).send(user.lockUntil)
    }
    if (user.lockUntil && user.lockUntil < Date.now()) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;


    }


    // check is password Correct

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      user.failedLoginAttempts += 1;


      //lock the account if fill max attempts 
      if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME)

      }
      await user.save()
      return res.status(401).send(user);
    }

    // Reset login attempts on success
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Proceed with login
    res.send("Login successful!");
  } catch (error) {
    console.log(error);
    res.status(500).send(`server error : ${error}`)
  }



}

// subscribe user to newletter
const subscribeToNewsletter = async (req, res) => {
  try {
    const {email}  = req.body;

    // valide email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(user.isSubscribed) {
      return res.status(400).json({ message: "Already subscribed to the newsletter" });
    }

    // Update the user's subscription status
    user.isSubscribed = true;
    await user.save();

    res.status(200).json({ message: "Successfully subscribed to the newsletter" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

// get the subscribed user
const getSubscribedUser = async (req, res) => {
  try {
    const { email } = req.params;

     // valide email
     if (!email || !email.includes('@')) {
      return res.status(400).json({ message: "Invalid email address", isSubscribed: false });
    }

    const user = await User.findOne({email}).select('isSubscribed');
    if (!user) {
      return res.status(404).json({ message: 'User not found', isSubscribed: false });
    }

    res.status(200).json({isSubscribed: user.isSubscribed});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscribed users", error: error.message, isSubscribed: false });
  }
};

// follow restaurant
const followRestaurant = async (req, res) =>{
  const {userEmail, restaurantEmail} = req.body;
  try{
    const restaurant = await User.findOne({email: restaurantEmail});
    if(!restaurant) {
      res.status(404).json({message: "Restaurant not found"});
    }
    if(restaurant.restaurantDetails.followers.includes(userEmail)){
      restaurant.restaurantDetails.followers.pull(userEmail); //user already following the restaurant and unfollow it
      await restaurant.save();
      return res.status(200).json({message: "Unfollowed the restaurant successfully", isFollowing: false});
    }else{
      restaurant.restaurantDetails.followers.push(userEmail); //user not following the restaurant and follow it
      await restaurant.save();
      return res.status(200).json({message: "Followed the restaurant successfully", isFollowing: true});
    }
    
  }catch(error){
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


module.exports = { 
  registerUser, 
  allRestaurants, 
  getUsers, 
  getUser, 
  updateUserRole, 
  deleteUser, 
  logInAttempts, 
  updateResturantProfile, 
  updateUserProfile, 
  getRestaurantProfile,
  subscribeToNewsletter,
  getSubscribedUser,
  followRestaurant
};
