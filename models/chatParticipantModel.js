const { DataTypes } = require("sequelize");
const { sequelize } = require("../sqldatabase");

module.exports = (sequelize, DataTypes) => {
  const ChatParticipant = sequelize.define(
    "chatparticipant",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: { type: DataTypes.BIGINT, allowNull: false },
      chatRoomId: { type: DataTypes.BIGINT, allowNull: false },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { timestamps: true }
  );

  return ChatParticipant;
};
