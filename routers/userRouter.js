const router = require('express').Router();
const userController = require('../controllers/userController')
const {body} = require('express-validator')




router.post('/login',
    body('email').isLength({min: 2, max: 30}),
    body('password').isLength({min: 2, max: 10}),
    userController.login)

router.post('/registration',
    //body_bg('email').trim().isEmail,
    body('email').isLength({min: 2, max: 30}),
    body('password').isLength({min: 2, max: 10}),
    userController.registration)

router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activateMail)
router.get('/refresh', userController.refresh)
router.get('/auth', userController.authStart)
router.post('/test', userController.testEmail)


module.exports = router


