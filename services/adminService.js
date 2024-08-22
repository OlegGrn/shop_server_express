const {User, Role} = require('../models/allModels')
const ApiError = require('../errors/apiError')


const ADMIN = process.env.ADMIN || 'ADMIN'

class AdminService {

    async addData(email) {
        //предварительно мидлвэар проверяет полномочия на подобные действия...
        const candidate = await User.findOne({
            where: {email}
        })

        if (!candidate) {
            throw ApiError.badRequest(`Пользователь ${email} не зарегистрирован`)
        }
        const {id: id_user} = candidate
        const candidateAdmin = await Role.findOne({
            where: {id_user, name: ADMIN}
        })
        if (candidateAdmin) {
            throw ApiError.badRequest(`Пользователь ${email} уже администратор`)
        }
        await Role.create({
            id_user, name: ADMIN
        })

        return true
    }

    async deleteData(id) {

        if(id === undefined){
            throw ApiError.badRequest(`Нет данных`)
        }

        let arrId = Array.isArray(id) ? id : [id];

        let moreAdmin = await Role.findAll({where: {name: ADMIN}})
        if (moreAdmin.length <= id.length) {
            throw ApiError.badRequest('Невозможно удалить всех администраторов')
        }

        await Role.findAll({
            where: {
                id_user: arrId,
                name: ADMIN
            }
        }).then(arr => arr.forEach(item => item.destroy()))
    }


    async getData() {

        return await Role.findAll({
            where: {
                name: ADMIN
            },
            include: User,

        })
            .then(arr => arr
                .map(item => ({id: item.user.id, name: item.user.email})))
    }


}

module.exports = new AdminService()