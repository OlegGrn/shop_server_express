const router = require('express').Router();
const DeviceController = require('../controllers/deviceController')
const checkPowers  = require("../middlewares/checkPowers")

const ADMIN = process.env.ADMIN || "ADMIN"


router.post('/', checkPowers([ADMIN]), DeviceController.asyncNewData)
router.delete('/', checkPowers([ADMIN]), DeviceController.deleteData)
router.get('/all',  DeviceController.getAll)
router.get('/one/:id', DeviceController.getOne)
router.get('/list',checkPowers([ADMIN]), DeviceController.getList)




module.exports = router