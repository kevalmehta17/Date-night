import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        //401 is the status code for unauthorized
      });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.jwtSecret);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    // Check if user exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = currentUser; // Attach user data to req
    next(); // Move to the next middleware
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
