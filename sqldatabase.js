const {Sequelize, DataTypes} = require('sequelize')

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5432
//database name is postgres
const sequelize = new Sequelize(`postgres://postgres:postgres@localhost:5432/postgres`, {dialect: "postgres"})

//checking connection
sequelize.authenticate()
    .then(() => {console.log("POSTGRES server connected to the app")})
    .catch((err) => {console.error("Database not connected",err);
    })

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting models to database
db.users = require('./models/userModel') (sequelize,DataTypes)


module.exports = db
