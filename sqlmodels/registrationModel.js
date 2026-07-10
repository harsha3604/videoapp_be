export default (sequelize, DataTypes) => {
  const Registration = sequelize.define(
    "registration",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      registeredAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      paymentStatus: {
        type: DataTypes.ENUM("pending", "paid"),
        defaultValue: "pending",
      },
      attendanceStatus: {
        type: DataTypes.ENUM("registered", "cancelled"),
        defaultValue: "registered",
      },
    },
    { timestamps: true },
  );

  return Registration;
};
