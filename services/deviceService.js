const ApiError = require("../errors/apiError")
const {
    Device,
    SizeDevice,
    Type,
    Category,
    Size, Path
} = require("../models/allModels");
const madeDataDevice = require('../utils/madeDataDevice')
const madeOneDevice = require('../utils/madeOneDevece')
const {Op} = require('sequelize')

class DeviceService {

    async newCreate(reqBody, randomData) {
        const {name, price, description, id_category, id_type, sizes} = reqBody;

        if (!name && !price && !description && (sizes.length === 0)) {
            throw ApiError.badRequest("Неполные данные")
        }
        //sizes = "[{id_size, quantity},{id_size, quantity}]" - массив в JSON
        // Делаем из строки массив и проверяем полноту данных в массиве
        let arrSizes = JSON.parse(sizes)
        let test = arrSizes.reduce((sum, {id_size, quantity}) => {
            if (!id_size || !quantity) {
                sum++
            }
            return sum
        }, 0)
        if (test !== 0) {
            throw ApiError.badRequest(`Неполные данные, test = ${test}`)
        }
        // Проверяем на уникальность имени
        const candidate = await Device.findOne({
            where: {name}
        })
        if (candidate) {
            throw ApiError.badRequest(`Ошибка, товар ${name} уже есть`)
        }
        //делаем массив путей для фото, для загрузки в базу
        // randomData это string[] | null
        const arrPath = Array.isArray(randomData)
            ? randomData.map(pathImg => ({name: pathImg}))
            : [];

        // создаем товар сразу с ассоциациациями [SizeDevice, Path]
        return await Device.create({
            name, price, description, id_category, id_type,
            img: arrPath.length > 0,
            sizeDevices: arrSizes, //[{id_size, quantity}, {id_size, quantity}]
            paths: arrPath // [{name: string}, {name: string}] || []
        }, {
            include: [SizeDevice, Path]
        })
    }

    //{ id: '19' }
    //{ id: [ '19', '21', '24' ] }
    async delete(id) {
        if (id === undefined) {
            throw ApiError.badRequest(`Нет данных`)
        }
        let arrId = Array.isArray(id) ? id : [id];

        await Device.findAll({
            where: {id: arrId},
            include: [SizeDevice, Path]
        }).then(res => res.map(item => item.destroy()))
    }

    async getOne(id) {
        let data = await Device.findOne({
            where: {id},
            include: [Size, Type, Category, Path]
        })
        return madeOneDevice(data)
    }


    async getList() {
        const data = await Device.findAll({
            include: [Type, Category, Size]

        })

        if (data.length === 0) return data

        return data.map(({id, name, type, category, price, sizes}) => {

            return [id, name, type.name, category.name, price,
                sizes
                    .map(size => size.name)
                    .sort((a, b) => a - b)
                    .join(" , ")]
        })
    }


    // {"type":["4","2"],"category":["17"],"size":["5"],"limit":"4","currentPage":"1"}
    async getAll({
                     limit = '9',
                     currentPage = '1',
                     type = [],
                     category = [],
                     size = []

                 }) {
        limit = Number(limit)
        currentPage = Number(currentPage)
        const offset = limit * currentPage - limit;

        let data = await Device.findAndCountAll({
            //Определяет порядок сортировки вывода данных. Если его не задать, случаются ошибки
            //по выводу данных - один и тот же товар может быть выдан с сервера дважды
            //при переключении между страницами (пагинация)
            order: [
                ['id', 'ASC']
            ],
            //если этого показателя нет, то товары с одним ID, но с разными размерами
            //увеличивают count (т.е. один товар с 3-мя размерами даёт count === 3)
            distinct: true,

            //Реализация механизма выборки с условиями по Type, Category, Size, т.е когда мы хотим
            // получать товары по каким-то критериям. Эти критерии в массиве запроса. И мы хотим
            // получить их общее число CountAll для пагинации и реализовать в дельнейшем "подгрузить ещё".
            // Ищем в базе по указанным ID в массивах запросов. По тем запросам, которых нет,
            // товары ID > 0 = [Op.gt]: 0

            include: [{
                model: Type,
                where: {
                    id: type.length > 0
                        ? type
                        : {
                            [Op.gt]: 0
                        }
                }
            },{
                model: Category,
                where: {
                    id: category.length > 0
                        ? category
                        : {
                            [Op.gt]: 0
                        }
                }
            },{
                model: Size,
                where: {
                    id: size.length > 0
                        ? size
                        : {
                            [Op.gt]: 0
                        }
                }
            }, Path],

            limit,
            offset
        })
        return madeDataDevice(data)
    }
}

module.exports = new DeviceService()


