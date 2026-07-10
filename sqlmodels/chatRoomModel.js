export default (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define(
    "chatroom",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      groupName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdBy: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return ChatRoom;
};
