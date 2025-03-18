const User = require("../model/authModel");

const registerUser = async (req, res) => {
  const { username, email, photo } = req.body;
  try {
    //Check Existing User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exist" });
    }

    //Save New user in DB
    const nweUser = new User({
      username,
      photo,
      email,
    });
    await nweUser.save();
    res.status(201).send({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).send({ message: "server Error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "server error" });
  }
};

// get user role by email
const getUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({email});

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.json(user );
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { registerUser, getUsers, getUser };
