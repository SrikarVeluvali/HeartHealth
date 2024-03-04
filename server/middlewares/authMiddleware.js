import jwt from "jsonwebtoken";
import authModel from "../models/authModel.js";

/**
 * Middleware to check if the user is authenticated.
 * Extracts the JWT token from the Authorization header,
 * verifies it, and attaches the user information to the request object.
 * If the token is invalid or not present, returns a 401 unauthorized response.
 */
const checkIsUserAuthenticated = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  // Check if Authorization header is present and starts with "Bearer"
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // Extract the token from the Authorization header
      token = authorization.split(" ")[1];

      // Verify the token
      const { userID } = jwt.verify(token, "HeartHealthProjectKMIT");

      // Get User from Token and attach to the request object
      req.user = await authModel.findById(userID).select("-password");

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Token verification failed
      return res.status(401).json({ message: "Unauthorized User" });
    }
  } else {
    // No Authorization header or doesn't start with "Bearer"
    return res.status(401).json({ message: "Unauthorized User" });
  }
};

export default checkIsUserAuthenticated;
