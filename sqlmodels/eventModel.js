export default (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "event",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Location not specified",
      },
      locationLink: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Location link not specified",
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: true },
  );

  return Event;
};
