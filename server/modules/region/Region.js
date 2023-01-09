const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const District = require("../district/District");

const Region = sequelize.define("region", {
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

Region.hasMany(District, { as: "districts", foreignKey: "regionId" });
District.belongsTo(Region, { as: "region" });

module.exports = Region;
 