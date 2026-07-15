//importing modules
import bcrypt from "bcrypt";
import db from "../sqldatabase.js";
import jwt from "jsonwebtoken";
import userAuth from "../middleware/userAuth.js";
import express from "express";
import profileUpload from "../middleware/profileUpload.js";

const router = express.Router();
const User = db.User;

router.post(
  "/create",
  profileUpload.single("image"),
  userAuth.saveUser,
  async (req, res) => {
    try {
      const { userName, email, password, phoneNumber, age, gender } = req.body;

      if (!userName || !email || !password) {
        userAuth.cleanupUploadedFile(req);
        return res.status(409).json({ message: "Details are not correct" });
      }

      const imagePath = req.file
        ? `/uploads/profile-images/${req.file.filename}`
        : null;

      const data = {
        userName,
        email,
        password: await bcrypt.hash(password, 10),
        phoneNumber: phoneNumber,
        age: age,
        image: imagePath,
        gender: gender,
      };

      const user = await User.create(data);

      if (user) {
        let token = jwt.sign({ id: user.id }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

        return res.status(201).json({
          message: "User created Successfully",
        });
      } else {
        userAuth.cleanupUploadedFile(req);
        return res.status(409).json({ message: "Details are not correct" });
      }
    } catch (error) {
      console.log(error);
      userAuth.cleanupUploadedFile(req);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
);

// Handles multer-specific errors (wrong file type, over the 5MB limit).
// These throw before reaching the handler above, so they need their own
// catch here. Multer itself doesn't write a file to disk when fileFilter
// rejects it, so there's nothing to clean up in this branch.
router.use((err, req, res, next) => {
  if (
    err instanceof multer.MulterError ||
    err.message?.includes("Only image files")
  ) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      if (isSame) {
        let token = jwt.sign({ id: user.id }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60,
        });
        res.cookie("jwt", token, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        return res.status(201).json({ message: "Logged In", user: user });
      } else {
        return res.status(401).json({ message: "Authentication failed" });
      }
    } else {
      return res.status(401).json({ message: "Authentication failed" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

router.get("/verify", async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "No token found" });

    const decoded = jwt.verify(token, process.env.secretKey);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
});

export default router;
