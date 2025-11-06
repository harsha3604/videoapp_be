// importing modules

const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// port
const PORT = process.env.BACKEND_PORT || 8000;

// creating express app
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_URL, credentials: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.NO_SQL_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//importing routes
const userRoutes = require("./users/routes");
const noteRoutes = require("./notes/routes");
const chatRoutes = require("./chats/routes");

//routes for the user API
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/chats", chatRoutes);

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
