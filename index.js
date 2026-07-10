// importing modules
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import eventRoutes from "./routes/eventsRoutes.js";

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

//routes for the user API
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/events", eventRoutes);

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
