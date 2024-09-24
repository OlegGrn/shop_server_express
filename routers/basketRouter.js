const router = require('express').Router();
const BasketController = require("../controllers/basketController")


router.post('/', BasketController.addData)
router.delete('/', BasketController.deleteData)
router.patch('/', BasketController.updateOrder)
router.get('/:id_user', BasketController.getDataUser)


module.exports = router