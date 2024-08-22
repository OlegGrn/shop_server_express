const apiError = require('../errors/apiError')
const TokenService = require('../services/tokenService')
const {Role} = require("../models/allModels");


function checkPowers(availableRoles = []) {

    return async function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next()
        }

        const strToken = req.headers.authorization;
        if (!strToken) {
            return  next(apiError.forbidden("нет авторизован")) //400
        }
        // получаем непосредственно сам токен из строки вида "Bearer ...token"
        const token = strToken.split(" ")[1];
        // в payload либо null, если токен не валидный, либо payload
        const payload = TokenService.validAccessToken(token)
        if (!payload) {
            return next(apiError.unauthorized("не валидный accessToken")) //401
        }
        // по ID из payload запрашиваем актуальный массив ролей в базе ROLE
        let data = await Role
            .findAll({where:{id_user: payload.id}})
            .then(res => res.map(item => item.name))

        console.log(data)
        let count = 0 //проверяем соответствие ролей пользователя с allowRoles
        availableRoles.forEach(role => {
            if (!data.includes(role)) {
                --count
            }
        })
        if (count >= 0) {
            return next()
        } else {
            return next(apiError.forbidden("Нет доступа"))
        }
    }
}

module.exports = checkPowers





