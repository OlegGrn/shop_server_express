const router = require('express').Router();
const checkPowers = require('../middlewares/checkPowers')
const AdminController = require("../controllers/adminBaseController");


const ADMIN = process.env.ADMIN || 'ADMIN'


router.post('/add', checkPowers([ADMIN]),  AdminController.addData.bind(AdminController))

router.post('/del', checkPowers([ADMIN]), AdminController.deleteData.bind(AdminController))

router.get("/",checkPowers([ADMIN]), AdminController.getData.bind(AdminController))

module.exports = router

//checkPowers([ADMIN]),
