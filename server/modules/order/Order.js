const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const orderStatus = require("../../core/constants/orderStatus");
const orderStatusUz = require("../../core/constants/orderStatusUz");
const RegiomModel = require("../region/Region");
const PackageModel = require("../package/Package");
const DistrictModel = require("../district/District");
const UserModel = require("../user/User");

const Order = sequelize.define(
  "order",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note: DataTypes.TEXT,
    recipientPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.ENUM(Object.values(orderStatus)),
      defaultValue: orderStatus.STATUS_NEW,
      allowNull: false,
    },
    orderStatusUz: {
      type: DataTypes.ENUM(Object.values(orderStatusUz)),
      defaultValue: orderStatusUz.STATUS_YANGI,
      allowNull: false,
    },
    deliveryPrice: DataTypes.INTEGER,
    totalPrice: {
      type: DataTypes.INTEGER,
      validate: {
        len: {
          args: [0, 5000000],
          msg: "qiymat 0 dan 50 mln oralig`ida bo`lishi kerak",
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
    expense : {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  { underscored: true, timestamps: true }
);

RegiomModel.hasMany(Order, {
  as: "orders",
  foreignKey: "regionId",
});
Order.belongsTo(RegiomModel, { as: "region" });

DistrictModel.hasMany(Order, {
  as: "orders",
  foreignKey: "districtId",
});
Order.belongsTo(DistrictModel, { as: "district" });

PackageModel.hasMany(Order, {
  as: "orders",
  foreignKey: "packageId",
});
Order.belongsTo(PackageModel, { as: "package" });

UserModel.hasMany(Order, {
  as: "order",
  foreignKey: "storeOwnerId",
});
Order.belongsTo(UserModel, { as: "storeOwner" });

module.exports = Order;
