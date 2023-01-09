const {DataTypes} = require("sequelize")
const sequelize = require("../../core/config/database/database")
const {hash} = require("bcrypt")
const userRole = require("../../core/constants/userRole")
const userRoleUz = require("../../core/constants/userRoleUz")
const Region = require("../region/Region");
const userStatus = require("../../core/constants/userStatus")
const userTariff = require("../../core/constants/userTariff")

const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passportNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userRole: {
        type: DataTypes.ENUM(Object.values(userRole)),
        allowNull: false
    },
    userRoleUz: {
        type: DataTypes.ENUM(Object.values(userRoleUz)),
        allowNull: false
    },
    regionId: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.ENUM(Object.values(userStatus)),
        defaultValue: userStatus.ACTIVE
    },
    storeName: {
        type: DataTypes.STRING,
    },
    chatId: {
        type: DataTypes.INTEGER
    },
    tariff: {
        type: DataTypes.ENUM(Object.values(userTariff)),
        defaultValue: null
    }
}, {
    underscored: true,
    hooks: {
        async beforeCreate(user) {
            user.password = await hash(user.password, 8)
        }, 
    }
})


Region.hasMany(User, {as: "user"})
User.belongsTo(Region)

module.exports = User