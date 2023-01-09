const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const Order = require("../order/Order");

const Tracking = sequelize.define(
  "tracking",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fromStatus: {
      type: DataTypes.STRING,
    },
    toStatus: {
      type: DataTypes.STRING,
    },
  },
  {
    underscored: true,
    updatedAt: false,
  }
);

Order.hasMany(Tracking, { as: "tracking" });
Tracking.belongsTo(Order, { as: "order" });

module.exports = Tracking;
