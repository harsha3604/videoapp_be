const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize(
  `postgres://postgres:postgres@localhost:5432/tutorial`,
  { dialect: "postgres" }
);

// Check connection
sequelize
  .authenticate()
  .then(() => console.log("POSTGRES server connected to the app"))
  .catch((err) => console.error("Database not connected", err));

const db = {};

// Import model factory functions
const userModel = require("./models/userModel");
const noteModel = require("./models/noteModel");

// Initialize models
db.User = userModel(sequelize, DataTypes);
db.Note = noteModel(sequelize, DataTypes);

// Define associations (after models are initialized)
db.User.hasMany(db.Note, { foreignKey: "userId", as: "notes" });
db.Note.belongsTo(db.User, { foreignKey: "userId", as: "user" });

// Add Sequelize and sequelize instance to db object
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Sync database
db.sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("Error syncing DB:", err));

module.exports = db;
