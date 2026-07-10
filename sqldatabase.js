import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";

// Load environment variables
dotenv.config();

// Import sqlmodels
import UserModel from "./sqlmodels/userModel.js";
import NoteModel from "./sqlmodels/noteModel.js";
import ChatRoomModel from "./sqlmodels/chatRoomModel.js";
import ChatParticipantModel from "./sqlmodels/chatParticipantModel.js";

// Initialize Sequelize
const sequelize = new Sequelize(
  `postgres://${process.env.SQL_DATABASE_USER}:${process.env.SQL_DATABASE_PASSWORD}@localhost:5432/${process.env.SQL_DATABASE_NAME}`,
  { dialect: "postgres" }
);

// Test connection
try {
  await sequelize.authenticate();
  console.log("POSTGRES server connected to the app");
} catch (err) {
  console.error("Database not connected", err);
}

// Initialize db object
const db = {};

// Initialize sqlmodels
db.User = UserModel(sequelize, DataTypes);
db.Note = NoteModel(sequelize, DataTypes);
db.ChatRoom = ChatRoomModel(sequelize, DataTypes);
db.ChatParticipant = ChatParticipantModel(sequelize, DataTypes);

// Define associations (AFTER sqlmodels are initialized)
db.User.hasMany(db.Note, { foreignKey: "userId", as: "usernotes" });

db.User.hasMany(db.ChatRoom, { foreignKey: "createdBy", as: "userchatroom" });

db.User.hasMany(db.ChatParticipant, {
  foreignKey: "userId",
  as: "userchatparticipant",
});

db.Note.belongsTo(db.User, { foreignKey: "userId", as: "noteuser" });

db.ChatRoom.belongsTo(db.User, {
  foreignKey: "createdBy",
  as: "chatroomuser",
});

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

// Add Sequelize constructor & instance
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Sync sqlmodels with DB
try {
  await sequelize.sync({ alter: true });
  console.log("Database synced successfully");
} catch (err) {
  console.error("Error syncing DB:", err);
}

export default db;
