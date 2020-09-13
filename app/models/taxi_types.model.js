const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'taxi_types',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
};
