import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// SignUp User
const Signup = async (req, res) => {
  try {
    const data = req.body;

    // Check if 'admin' role is being assigned
    if (data.role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({ message: "An admin already exists." });
      }
    }

    // check wheater user already registered
    const existingUser = await User.findOne({ voterId: data.voterId });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This voter ID is already registered." });
    }

    const hashPassword = await bcrypt.hash(data.password, 10);
    data.password = hashPassword;

    const newUser = new User(data);

    const response = await newUser.save();

    res.status(200).json({ message: "Singup Successfully", data: response });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

// Login User
const Login = async (req, res) => {
  try {
    const { voterId, password } = req.body;

    // Find the user by voterId
    const user = await User.findOne({ voterId });

    // If user does not exist or password is incorrect
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1D" } // Token valid for 1 Day
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Fetch user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract the id from token

    const user = await User.findById(userId);
    res.status(200).json({ message: "User profile fetched", data: user });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Password Change
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user from token

    const { currentPassword, newPassword } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    // if password doesnot match, return error
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Password doesnot match" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

export { Signup, Login, getProfile, changePassword };
