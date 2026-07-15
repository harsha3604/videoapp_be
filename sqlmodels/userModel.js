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
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1234567890,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      image: {
        type: DataTypes.STRING, // URL to the profile image
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: false,
      },
    },
    { timestamps: true },
  );

  return User;
};
