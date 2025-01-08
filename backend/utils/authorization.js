import jwt from "jsonwebtoken";

// Middleware to verify token
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Extract token

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, "ncircle", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user; // Extract user information from payload
    next();
  });
};
