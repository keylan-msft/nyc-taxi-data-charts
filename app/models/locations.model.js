const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'locations',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      borough: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      zone: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      service_zone: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
};
