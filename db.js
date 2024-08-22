const {Sequelize} = require('sequelize')

const PATH_SHOP = process.env.PATH_SHOP

module.exports = new Sequelize(PATH_SHOP)