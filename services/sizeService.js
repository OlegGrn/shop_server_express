const ApiError = require("../errors/apiError");
const { Size, SizeDevice} = require("../models/allModels");
const sequelize = require("../db");


class SizeService {

    async addData(name) {

        if (!name) {
            throw ApiError.badRequest("Незаполненны данные")
        }
        const candidate = await Size.findOne({where: {name}})
        if (candidate) {
            throw ApiError.badRequest(`${name} уже существует`)
        }
        await Size.create({name})

    }

    async deleteData(id) {

        if (id === undefined) {
            throw ApiError.badRequest(`Нет данных`)
        }

        let arrId = Array.isArray(id) ? id : [id];

        const check = await SizeDevice.findAll({
            where: {id_size: arrId}
        })
        if (check.length > 0) {
            throw ApiError.badRequest(`Невозможно удалить, пока есть такие товары`)
        }

        await Size.findAll({
            where: {id: arrId}
        }).then(arr => arr.forEach(item => item.destroy()))

    }

    async getData() {
        const data = await Size.findAll({
            order:[
                ['name','ASC']
            ]
        })
        if (data.length > 0) {
            return data.map(({id, name}) => ({id, name}))
        } else return data
    }

    async getUnique() {
        return await SizeDevice.findAll({
            attributes: [
                sequelize.fn("DISTINCT", sequelize.col('id_size')),
                'id_size'
            ]
        })
            .then(arr => arr.map(item => item.id_size))
            .then(async dataId => await Size.findAll({
                where: {id: dataId},
                attributes: ["id", "name"],
                order:[['name', 'ASC']]
            }))
    }

}

module.exports = new SizeService()