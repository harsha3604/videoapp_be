const { DataTypes } = require("sequelize");
const { sequelize } = require("../sqldatabase");

module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define("note", {
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return Note;
};
