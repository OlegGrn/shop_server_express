const express = require('express')
const cors = require('cors')
//для загрузки изображений (файлов)
const fileupload = require('express-fileupload')
require('dotenv').config()
const routers = require('./routers/index')
const errorHandler = require('./middlewares/errorHandler')
const cookieParser = require('cookie-parser')
const path = require("path")
//подключаемся к БД
const sequelize = require('./db')
//создаем таблицы в БД
const models = require('./models/allModels')



const PORT = process.env.PORT || 7000
const STATIC_FOLDER = process.env.STATIC_FOLDER

const app = express()
app.use(express.json())
app.use(express.static(path.resolve(__dirname, STATIC_FOLDER)))
app.use(fileupload({}))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

app.use('/api', routers)

app.get("/", (res, req) => {
    req.status(200).json({text: "Working"})
})

app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate();
        //await sequelize.sync();
        //await models.GeneralBasket.sync({alter: true})
        app.listen(PORT)
        return "Start server on PORT = " + PORT
    } catch (e) {
        console.log(e)
        return e.message
    }

}
start().then(e => console.log(e));




