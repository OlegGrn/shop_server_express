const router = require('express').Router();
const BasketController = require("../controllers/basketController")


router.post('/add', BasketController.addData)
router.post('/del', BasketController.deleteData)
router.post('/update', BasketController.updateOrder)
router.get('/user/:id_user', BasketController.getDataUser)


module.exports = router