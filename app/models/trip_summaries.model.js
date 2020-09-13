const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('trip_summaries', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        taxi_type_id: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        pickup_borough_id: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        dropoff_borough_id: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        pickup_date: {
            allowNull: false,
            type: DataTypes.DATE
        },
        pickup_hour: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        average_passengers: {
            type: DataTypes.DECIMAL
        },
        total_passengers: {
            type: DataTypes.INTEGER
        },
        average_distance: {
            type: DataTypes.DECIMAL
        },
        total_distance: {
            type: DataTypes.DECIMAL
        },
        total_trips: {
            type: DataTypes.INTEGER
        },
        average_amount: {
            type: DataTypes.DECIMAL
        },
        total_amount: {
            type: DataTypes.DECIMAL
        }
	}, {
        timestamps: false
    });
};