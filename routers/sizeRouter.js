const router = require('express').Router();
const SizeController = require("../controllers/sizeBaseController")


const checkPowers = require("../middlewares/checkPowers");

const ADMIN = process.env.ADMIN || 'ADMIN'

router.delete('/', checkPowers([ADMIN]), SizeController.deleteData.bind(SizeController))
router.post('/', checkPowers([ADMIN]),  SizeController.addData.bind(SizeController))
router.get('/', SizeController.getData.bind(SizeController))
router.get('/unique', SizeController.getUnique.bind(SizeController))

module.exports = router

