const {Sequelize} = require("sequelize")
const vars = process.env


let isLog 
vars.DB_LOGGING === "true"? isLog = true: isLog = false


const databaseConfig = {
    host: vars.DB_HOST,
    port: vars.DB_PORT,
    database: vars.DB_NAME,
    username: vars.DB_USER,
    password: vars.DB_PASSWORD,
    dialect: vars.DB_DIALECT,
    logging: isLog  
}
const database = new Sequelize(databaseConfig)

module.exports = database