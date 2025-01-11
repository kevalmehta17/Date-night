import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// sign token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  const { name, email, password, age, gender, genderPreference } = req.body;

  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Check if all fields are provided
    if (!name || !email || !password || !age || !gender || !genderPreference) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist" });
    }

    // Check if age is 18 or older
    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "You must be 18 years or older to register",
      });
    }

    // Check if password is strong enough
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
    });

    // Generate token
    const token = signToken(newUser._id);

    // Set the JWT cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // prevents XSS attacks
      sameSite: "strict", // prevents CSRF attacks
      secure: process.env.NODE_ENV === "production", // only set cookies over HTTPS in production
    });

    res
      .status(201)
      .json({ success: true, user: { ...newUser._doc, password: undefined } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email }).select("+password"); // Select password field as it is hidden in the schema

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login time
    user.lastlogin = Date.now();
    await user.save();

    // Create token
    const token = signToken(user._id);

    // Set the JWT cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // prevents XSS attacks
      sameSite: "strict", // prevents CSRF attacks
      secure: process.env.NODE_ENV === "production", // only set cookies over HTTPS in production
    });

    res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // ensures the cookie is cleared for production environment
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error during logout" });
  }
};
