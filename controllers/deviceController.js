const DeviceService = require("../services/deviceService")
const ImageService = require("../services/imageService")


class DeviceController {

  async asyncNewData(req, res, next) {
        try {
            // POST запрос, тело запроса в req.body,
            // Если были переданы в req файлы с фото, они лежат в req.files,
            // в поле "img" - это имя инпута, прикрепляющего файлы у клиента,
            // в req.files.img Это будет массив (если фото > 1) или один файл.

            // получаем string[] с рандомными именами
            let randomData = req.files ? ImageService.madeRandom(req.files) : null;
            // создаем новый товар
            let newDevice = await DeviceService.newCreate(req.body, randomData)

            if (req.files && newDevice && randomData) {
                //создаем папку для хранения фотографий
                await ImageService.madeFolderImg(req.files, newDevice.id)
                //перемещаем фотографии в созданную папку
                await ImageService.moveImg(req.files, randomData, newDevice.id)
            }

            return res.status(200).json({message: `Товар с ID = ${newDevice.id} добавлен`})
        } catch (err) {
            next(err)
        }
    }


    async getAll(req, res, next) {
        try {
            const request = req.query || {}
            const data = await DeviceService.getAll(request)
            return res.status(200).json(data)

        } catch (err) {
            next(err)
        }
    }


    async getOne(req, res, next) {
        console.log(req.params.id)
        try {
            let id_product = req.params.id
            let product = await DeviceService.getOne(id_product)
            return res.status(200).json(product)
        } catch (err) {
            next(err)
        }

    }

    async getList(req, res, next) {
        try {
            let data = await DeviceService.getList()
            return res.status(200).json(data)
        } catch (err) {
            next(err)
        }
    }


    async deleteData(req, res, next) {
        try {
            const id = req.body.id
            await DeviceService.delete(id)
            const text_id = Array.isArray(id)
                ? id.join(", ")
                : id.toString()
            await ImageService.delFolderImg(id)

            return res.status(200).json({message: `Товар ID ${text_id} удален`})
        } catch (err) {
            next(err)
        }
    }


}

module.exports = new DeviceController()