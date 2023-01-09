const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const UserModel = require("../user/User");
const statusPackages = require("../../core/constants/packageStatus")
const statusPackagesUz = require("../../core/constants/packageStatusUz")
const Package = sequelize.define(
  "package",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    packageTotalPrice: {
      type: DataTypes.INTEGER,
      validate: {len: {args: [0, 200000000], msg: "qiymati 0 dan 2 mlrd dan kam bo`lmasligi kerak"}}
    },
    packageStatus: {
      type: DataTypes.ENUM(Object.values(statusPackages)),
      defaultValue: statusPackages.STATUS_NEW
    },
    packageStatusUz: {
      type: DataTypes.ENUM(Object.values(statusPackagesUz)),
      defaultValue: statusPackagesUz.STATUS_YANGI
    }

  },
  { underscored: true }
);

UserModel.hasOne(Package, { as: "package", foreignKey: "storeOwnerId" });
Package.belongsTo(UserModel, { as: "storeOwner" });

module.exports = Package;
