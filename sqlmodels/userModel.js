export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true },
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("founder", "member"),
        allowNull: false,
        defaultValue: "member",
      },
    },
    { timestamps: true },
  );

  return User;
};
