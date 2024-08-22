const ApiError = require("../errors/apiError");
const {Category, Device} = require("../models/allModels");
const regExp = new RegExp(`${process.env.REG_EXP_TYPE_CATEGORY}`)
const sequelize = require('../db')

class CategoryService {
    async addData(name) {
        if (!name) {
            throw ApiError.badRequest("Незаполненны данные")
        }
        if (!regExp.test(name)) {
            throw ApiError.badRequest("Неверные данные")
        }

        let candidate = await Category.findOne({where: {name}});
        if (candidate) {
            throw ApiError.badRequest(`${name} уже существует`)

        }
        await Category.create({name})
        return true
    }

    async deleteData(id) {
        if (id === undefined) {
            throw ApiError.badRequest(`Нет данных`)
        }
        let arrId = Array.isArray(id) ? id : [id];

        let check = await Device.findAll({
            where: {id_category: arrId}
        })

        if (check.length > 0) {
            throw ApiError.badRequest(`Невозможно удалить, пока есть такие товары`)
        }

        await Category.findAll({
            where: {id: arrId}
        }).then(arr => arr.forEach(item => item.destroy()))
    }


    async getData() {
        const data = await Category.findAll({
            order:[
                ['name', 'ASC']
            ]
        })
        if (data.length > 0) {
            return data.map(({id, name}) => ({id, name}))
        } else return data
    }

    async getUnique() {
        return await Device.findAll({
            attributes: [
                sequelize.fn("DISTINCT", sequelize.col("id_category")),
                "id_category"
            ]
        })
            .then(arr => arr.map(item => item.id_category))
            .then(async (data) => await Category.findAll({
                attributes: ["id", "name"],
                where: {
                    id: data
                },
                order:[
                    ['name', 'ASC']
                ]
            }))

    }
}

module.exports = new CategoryService()