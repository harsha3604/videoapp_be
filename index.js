// importing modules

const express = require("express");
const sequelize = require("sequelize");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const db = require("./sqldatabase");
const cors = require("cors");
//importing routes

const userRoutes = require("./users/routes");
const noteRoutes = require("./notes/routes");

// port
const PORT = process.env.PORT || 8000;

// creating express app
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//synchronizing the database and forcing it to false so we dont lose data
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("db has been re synced");
// });

//routes for the user API
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
