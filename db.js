const {Sequelize} = require('sequelize')

const PATH_SHOP = process.env.PATH_SHOP_2

module.exports = new Sequelize(PATH_SHOP)