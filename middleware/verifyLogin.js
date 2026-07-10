import jwt from "jsonwebtoken";
import db from "../sqldatabase.js";

const User = db.User;

const verifyLogin = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "No token found" });

  const decoded = jwt.verify(token, process.env.secretKey);
  const user = await User.findByPk(decoded.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  req.loginData = {
    userId: user.dataValues.id,
  };
  next();
};

//exporting module
export default { verifyLogin };
