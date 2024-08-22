const router = require('express').Router();
const CategoryController = require('../controllers/categoryBaseController')
const checkPowers = require("../middlewares/checkPowers");

const ADMIN = process.env.ADMIN || 'ADMIN'

router.post('/delete', checkPowers([ADMIN]), CategoryController.deleteData.bind(CategoryController))
router.post('/', checkPowers([ADMIN]), CategoryController.addData.bind(CategoryController))
router.get('/', CategoryController.getData.bind(CategoryController))
router.get('/unique', CategoryController.getUnique.bind(CategoryController))

module.exports = router