const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'boroughs',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
};
