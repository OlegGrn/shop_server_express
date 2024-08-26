const {User, Role, Basket} = require('../models/allModels')
const bcrypt = require('bcrypt')
const ApiError = require('../errors/apiError')
const dataUser = require('../utils/dataUser')
const TokenService = require('./tokenService')
const {v4: uuidv4} = require('uuid');

//const mailService = require('./mailService')

const USER = process.env.USER
const ADMIN = process.env.ADMIN



class UserService {

    async login(email, password) {
        const candidate = await User.findOne({where: {email: email}});
        if (!candidate) {
            throw ApiError.badRequest(`Пользователь ${email} не зарегистрирован`)
        }
        const checkPassword = await bcrypt.compareSync(password, candidate.password)
        if (!checkPassword) {
            throw ApiError.badRequest('Пароль неверный')
        }
        const payload = await dataUser(candidate.id, email) // на выходе объект {id, roles}
        console.log(payload)
        const {accessToken, refreshToken} = await TokenService.madeTokens(payload)
        return {accessToken, refreshToken, payload}

    }

    async registration(email, password) {
        if (!(email ?? password)) {
            throw ApiError.badRequest("Незаполненны данные")
        }
        if (email.length < 2 || password.length < 2) {
            throw ApiError.badRequest("Неверные данные")
        }
        const candidate = await User.findOne({where: {email: email}});
        if (candidate) {
            throw ApiError.badRequest(`Пользователь ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const ud = uuidv4();

        // здесь почтовый клиент для отправки
        let payload;
        let tokens = await User
            .create({email, password: hashPassword, checkedLink: ud})
            .then(async user => {
                const nameUser = USER

                //для первой регистрации админа в базе
                //const nameAdmin = ADMIN

                payload = {id: user.id, email, roles: [nameUser]}
                let promise = await Promise.all([
                    TokenService.madeTokens(payload),
                    Role.create({
                        id_user: user.id,
                        name: nameUser
                        //name: nameAdmin // для первой регистрации
                    }),
                    //здесь promise для почтового клиента.

                    //Basket.create({id_user: user.id}), // этой таблицы уже нет
                ])
                return promise[0] //возвращаем пару токенов
            })
        return {...tokens, payload}
    }

    async logout(refreshToken) {
        return !!await TokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.forbidden("Не авторизован") //было так ранее throw ApiError.unauthorized()
        }
        //let user = TokenService.validRefreshToken(refreshToken);
        let payload = TokenService.validRefreshToken(refreshToken)

        //if(!user) {
        if (!payload) {
            throw ApiError.forbidden("Не авторизован") //было так ранее throw ApiError.unauthorized()
        }
        let checkDb = await TokenService.checkRefreshToken(refreshToken);
        if (!checkDb) {
            throw ApiError.forbidden("Не авторизован") //было так ранее throw ApiError.unauthorized()
        }
        // нет смысла, так как эта опция на рефреш accesTokena с временем жизни 15 минут
        //const payload = await dataUser(user.id) // обновленный payload для токенов (инфо выше)
        return TokenService.madeTokens(payload) // делаем и возвращаем два новых токена
    }

    async authStart(refreshToken) {
        if (!refreshToken) {
            throw ApiError.badRequest("Не авторизован")
        }
        const payload = TokenService.validRefreshToken(refreshToken)
        if (!payload) {  // в payload либо null либо payload
            throw ApiError.badRequest("Не авторизован")
        }
        let checkDb = await TokenService.checkRefreshToken(refreshToken, payload.id);
        if (!checkDb) {
            throw ApiError.forbidden("Не авторизован")
        }
        const refreshPayload = await dataUser(payload.id, payload.email)
        const tokens = await TokenService.madeTokens(refreshPayload)
        //console.log("tokens = " + tokens)
        return {...tokens, payload: refreshPayload}
    }
}

module.exports = new UserService()