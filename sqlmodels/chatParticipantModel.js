export default (sequelize, DataTypes) => {
  const ChatParticipant = sequelize.define(
    "chatparticipant",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      chatRoomId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return ChatParticipant;
};
