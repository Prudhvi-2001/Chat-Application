const { loginService,searchUsers } = require('../services/authService');
const User = require('../models/User'); 

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { token, user } = await loginService(username, password);
    res.status(200).json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
      const userId = req.user._id; 
      const user = await User.findById(userId).select('-password')
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
};

const searchUsersList = async (req,res) => {
  try {
    const query = req.query.q;
    const users = await searchUsers(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
}
module.exports = {
  signIn,
  signUp,
  getUserProfile,
  searchUsersList
};
