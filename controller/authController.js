const User = require("../model/authModel");

const registerUser = async (req, res) => {
  const { username, email, photo, role } = req.body;
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
      role
    });
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


module.exports = { registerUser, getUsers, getUser, updateUserRole, deleteUser, updateResturantProfile };
