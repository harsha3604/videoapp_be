import jwt from "jsonwebtoken";
import db from "../sqldatabase.js";

const User = db.User;

const roleOnly = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.jwt;

      if (!token) {
        return res.status(401).json({ message: "No token found" });
      }

      const decoded = jwt.verify(token, process.env.secretKey);

      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};

export default roleOnly;
