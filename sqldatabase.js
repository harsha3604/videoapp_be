const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize(
  `postgres://${process.env.SQL_DATABASE_USER}:${process.env.SQL_DATABASE_PASSWORD}@localhost:5432/${process.env.SQL_DATABASE_NAME}`,
  { dialect: "postgres" }
);

//synchronizing the database and forcing it to false so we dont lose data
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("db has been re synced");
// });

// Check connection
sequelize
  .authenticate()
  .then(() => console.log("POSTGRES server connected to the app"))
  .catch((err) => console.error("Database not connected", err));

const db = {};

// Import model factory functions
const userModel = require("./models/userModel");
const noteModel = require("./models/noteModel");
const chatRoomModel = require("./models/chatRoomModel");
const chatParticipantModel = require("./models/chatParticipantModel");

// Initialize models
db.User = userModel(sequelize, DataTypes);
db.Note = noteModel(sequelize, DataTypes);
db.ChatRoom = chatRoomModel(sequelize, DataTypes);
db.ChatParticipant = chatParticipantModel(sequelize, DataTypes);

// Define associations (after models are initialized)
db.User.hasMany(db.Note, { foreignKey: "userId", as: "usernotes" });
db.User.hasMany(db.ChatRoom, { foreignKey: "createdBy", as: "userchatroom" });
db.User.hasMany(db.ChatParticipant, {
  foreignKey: "userId",
  as: "userchatparticipant",
});
db.Note.belongsTo(db.User, { foreignKey: "userId", as: "noteuser" });
db.ChatRoom.belongsTo(db.User, { foreignKey: "createdBy", as: "chatroomuser" });
db.ChatRoom.hasMany(db.ChatParticipant, {
  foreignKey: "chatRoomId",
  as: "chatroomchatparticipant",
});
db.ChatParticipant.belongsTo(db.User, {
  foreignKey: "userId",
  as: "chatroomparticipantuser",
});
db.ChatParticipant.belongsTo(db.ChatRoom, {
  foreignKey: "chatRoomId",
  as: "chatparticipantchatroom",
});

// Add Sequelize and sequelize instance to db object
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Sync database
db.sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("Error syncing DB:", err));

module.exports = db;
