import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      }); // Return to stop further execution
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if user exists in the database using the ID from the token
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user data to the request object
    req.user = currentUser;
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
