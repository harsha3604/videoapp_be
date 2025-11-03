//importing modules
const bcrypt = require("bcrypt");
const db = require("../sqldatabase");
const jwt = require("jsonwebtoken");
const userAuth = require("../middleware/userAuth");
const express = require("express");
const router = express.Router();

const User = db.User;

router.post("/create", userAuth.saveUser, async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const data = {
      userName,
      email,
      password: await bcrypt.hash(password, 10),
    };

    if (!userName || !email || !password) {
      return res.status(409).json({ message: "Details are not correct" });
    }

    //saving the user
    const user = await User.create(data);

    //if user details is captured
    //generate token with the user's id and the secretKey in the env file
    // set cookie with the token generated
    if (user) {
      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });
      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);

      //send users details
      return res.status(201).json({
        message: "User created Successfully",
      });
    } else {
      return res.status(409).json({ message: "Details are not correct" });
    }
  } catch (error) {
    console.log(error);
  }
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

module.exports = router;
