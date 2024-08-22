const ApiError = require("../errors/apiError");
const {Type, Device, Size} = require("../models/allModels");
const sequelize = require('../db')
const regExp = new RegExp(`${process.env.REG_EXP_TYPE_CATEGORY}`)
const {Op} = require('sequelize')


class TypeService {

    async addData(name) {
        if (!name) {
            throw ApiError.badRequest("Незаполненны данные")
        }
        if (!regExp.test(name)) {
            throw ApiError.badRequest("Неверные данные")
        }
        const candidate = await Type.findOne({where: {name}})
        if (candidate) {
            throw ApiError.badRequest(`${name} уже существует`)
        }
        await Type.create({name})
    }

    async deleteData(id) {
        if(id === undefined){
            throw ApiError.badRequest(`Нет данных`)
        }

        let arrId = Array.isArray(id) ? id : [id];

        let check = await Device.findAll({
            where: {id_type: arrId}
        })
        if (check.length > 0) {
            throw ApiError.badRequest(`Невозможно удалить, пока есть такие товары`)
        }

        await Type.findAll({
            where: {id: arrId}
        }).then(arr => arr.forEach(item => item.destroy()))
    }


    async getData() {
        const data = await Type.findAll({
            order: [
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
                sequelize.fn("DISTINCT", sequelize.col('id_type')),
                'id_type'
            ]
        })
            .then(arr => arr.map(item => item.id_type))
            .then(async (dataId) => await Type.findAll({
                attributes: ["id", "name"],
                where: {
                    id: dataId
                },
                order: [
                    ['name', 'ASC']
                ]
            }))
    }
}

module.exports = new TypeService()