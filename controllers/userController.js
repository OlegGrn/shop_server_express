const apiError = require('../errors/apiError')
const userService = require('../services/userService')
const {validationResult} = require('express-validator')
const mailService = require('../services/mailService')



class UserController {

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(apiError.badRequest("Ошибка валидации"))
            }
            const {
                accessToken,
                refreshToken,
                payload
            } = await userService.login(email, password)
            res.cookie('refreshToken', refreshToken, {
                maxAge: (30 * 24 * 60 * 60 * 1000), httpOnly: true
            })
            res.status(200).json({accessToken, payload})
        } catch (err) {
            next(err)
        }
    }

    async registration(req, res, next) {
        try {
            const {email, password} = req.body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(apiError.badRequest("Ошибка валидации"))
            }
            const {
                accessToken,
                refreshToken,
                payload
            } = await userService.registration(email, password)

            res.cookie('refreshToken', refreshToken, {
                maxAge: (30 * 24 * 60 * 60 * 1000), httpOnly: true
            })
            res.status(200).json({payload, accessToken})
        } catch (err) {
            next(err)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken: refreshTokenCook} = req.cookies;
            if(refreshTokenCook) {
                await userService.logout(refreshTokenCook);
                res.clearCookie('refreshToken');
                res.status(200).json({message: "refreshToken clear in cooke"})
            } else res.status(200).json({message: "Not found refreshToken in cooke"})
        } catch (err) {
            next(err)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken: refreshTokenCook} = req.cookies;
            const {
                accessToken,
                refreshToken
            } = await userService.refresh(refreshTokenCook)
            res.cookie('refreshToken', refreshToken, {
                maxAge: (30 * 24 * 60 * 60 * 1000), httpOnly: true
            })
            res.status(200).json({refreshToken, accessToken})

        } catch (err) {
            next(err)
        }
    }

    // ДОДЕЛАТЬ
    async activateMail(req, res, next) {
        try {
            const {link} = req.params
            res.json(link)
        } catch (err) {
            next(err)
        }
    }

    // дле тестирования отправки писем на почту
    async testEmail(req, res, next) {
        try {
            console.log("start test")
            const {email} = req.body
            console.log("email = " + email)
            const info = await mailService.sendActivationMail(email)
            res.json(email, info)
        } catch (err) {
            next(err)
        }
    }

    async authStart(req, res, next){
        try {
            const {refreshToken: refreshTokenCook} = req.cookies;
            const {
                accessToken,
                refreshToken,
                payload
            } = await userService.authStart(refreshTokenCook)

            res.cookie('refreshToken', refreshToken, {
                maxAge: (30 * 24 * 60 * 60 * 1000), httpOnly: true
            })
            res.status(200).json({accessToken, payload})
        } catch (err){
            next(err)
        }
    }

}

module.exports = new UserController()