const jwt = require('jsonwebtoken')
const {Token} = require('../models/allModels')


// в Db модель Token ограничение - id_user уникальные значения

class TokenService {

    static async madeTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN,
            {expiresIn: '1h'})
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN,
            {expiresIn: '30d'})

        const id_user = payload.id
        const candidate = await Token.findOne({where: {id_user}})

        if (candidate) {
            await candidate.update({refreshToken})
        } else {
            await Token.create({id_user, refreshToken})
        }
        return {accessToken, refreshToken}
    }

    static async removeToken(refreshToken){
       return await Token.destroy({
            where: {refreshToken}
        })

    }

    static validAccessToken(accessToken){
        try {
            return jwt.verify(accessToken, process.env.ACCESS_TOKEN)
        } catch {
            return null
        }
    }

    static validRefreshToken(refreshToken){
        try {
            return jwt.verify(refreshToken, process.env.REFRESH_TOKEN)
        } catch {
            return null
        }
    }

    static async checkRefreshToken(refreshToken, id_user){
        return await Token.findOne({
            where: {refreshToken, id_user}
        })
    }

    /*static async checkIdUser(id_user){
        return await Token.findOne({
            where: {id_user}
        })
    }*/
}

module.exports = TokenService