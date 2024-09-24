const router = require('express').Router();
const TypeController = require("../controllers/typeBaseController")
const checkPowers = require("../middlewares/checkPowers");

const ADMIN = process.env.ADMIN || 'ADMIN'


router.post('/', checkPowers([ADMIN]), TypeController.addData.bind(TypeController))
router.delete('/', checkPowers([ADMIN]), TypeController.deleteData.bind(TypeController))
router.get('/', TypeController.getData.bind(TypeController))
router.get('/unique', TypeController.getUnique.bind(TypeController))



module.exports = router