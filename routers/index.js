const router = require('express').Router();

const typeRouter = require('./typeRouter')
const categoryRouter = require('./categoryRouter')
const basketRouter = require('./basketRouter')
const userRouter = require('./userRouter')
const deviceRouter = require('./deviceRouter')
const sizeRouter = require('./sizeRouter')
const adminRouter = require('./adminRouter')


router.use('/user', userRouter)
router.use('/user/admin', adminRouter)
router.use('/type', typeRouter)
router.use('/category', categoryRouter)
router.use('/basket', basketRouter)
router.use('/device', deviceRouter)

router.use('/size', sizeRouter)



module.exports = router