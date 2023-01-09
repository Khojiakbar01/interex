const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const UserModel = require("../user/User");
const statusPackages = require("../../core/constants/packageStatus")
const statusPackagesUz = require("../../core/constants/packageStatusUz")
const OrderModel = require("../order/Order");

const PackageBack = sequelize.define(
  "packageBack",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    packageTotalPrice: {
      type: DataTypes.INTEGER,
    },
    packageStatus: {
      type: DataTypes.ENUM([statusPackages.STATUS_REJ_NEW, statusPackages.STATUS_REJ_OLD]),
      defaultValue: statusPackages.STATUS_REJ_NEW
    },
    packageStatusUz: {
      type: DataTypes.ENUM([statusPackagesUz.STATUS_OTKAZ_YANGI, statusPackagesUz.STATUS_OTKAZ_ESKI]),
      defaultValue: statusPackagesUz.STATUS_OTKAZ_YANGI
    }
  },
  { underscored: true }
);


UserModel.hasMany(PackageBack, { as: "packageBack", foreignKey: "storeOwnerId" });
PackageBack.belongsTo(UserModel, { as: "storeOwner" });

PackageBack.hasMany(OrderModel, {as: "rejOrders", foreignKey: "packageBackId"})
OrderModel.belongsTo(PackageBack, {as: "packageBack"})

module.exports = PackageBack;

