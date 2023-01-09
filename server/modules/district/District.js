const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const Region = require("../region/Region");

const District = sequelize.define("district", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
});

module.exports = District;
