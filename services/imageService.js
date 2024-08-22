// для создания рандомных имен
const uuid = require("uuid")
//Для создания, чтения и удаление папок в NodeJS
const fs = require('fs')
// для адаптации пути, для перемещения файла в папку 'static'
const path = require('path')

const STATIC_FOLDER = process.env.STATIC_FOLDER

class ImageService {
    constructor(folder_static) {
        //this._path_static = C:\#React\shop_081123_ts\server_ts_131223\static
        this._path_static = path.resolve(folder_static)

    }

    madeRandom(reqFiles) {
        // Axios удалил пустые строки с именем IMG и прислал на сервер
        // поле "img" в req.files, где будет массив (если фото > 1) или один файл.

        let quantityImg = reqFiles.img.length //либо число, либо undefined

        // рандомные имена для фотографий
        return quantityImg >= 1
            ? new Array(quantityImg).fill("I").map(() => (uuid.v4() + '.jpg'))
            : [`${uuid.v4()}.jpg`]
    }

    async madeFolderImg(reqFiles, id_device) {
        console.log("this._path_static = " + this._path_static)
        //создаем новый путь, где будет новая папка
        let newPath = path.join(this._path_static, id_device.toString())
        //создаем новую папку в folder_static по имени id_device
        await fs.mkdir(newPath, err => {
            if (err) throw  err
            console.log("Папка успешно создана")
        })
    }

    async moveImg(reqFiles, randomData, id_device) {
        // из фотографий делаем массив
        //reqFiles.img.length = число || undefined
        let arrFoto = reqFiles.img.length ? [...reqFiles.img] : [reqFiles.img];

        if (arrFoto.length === randomData.length) {
            arrFoto.forEach((foto, ind_foto) => {
                let pathFoto = path.resolve(
                    this._path_static, id_device.toString(), randomData[ind_foto]
                )
                foto.mv(pathFoto, err => {
                    if (err) {
                        console.log(`error moving files ${path.basename(foto)}`)
                    }
                })
            })
        } else {
            console.log(`error moving ALL files device ID = ${id_device}`)
        }


    }

    async delFolderImg(id) {
        // совет из документации: не нужно проверять доступность файла перед удалением
        // лучше выкинуть исключение, если пути к файлу нет
        if (id === undefined) {
            return
        }
        let arrId = Array.isArray(id) ? id : [id];

        arrId.map(async (idOne) => {
            // строим путь до папки
            const pathOne = path.join(this._path_static, idOne.toString())
            // удаляем папку //{recursive: true} - для удаления вложенных в неё файлов
            await fs.rm(pathOne, {recursive: true}, err => {
                if (!err) {
                    console.log(`folder ${idOne} deleted`);
                } else {
                    console.log(`folder ${idOne} NOT deleted`);
                    console.log(err);
                }
            })
        })
    }
}

module.exports = new ImageService(STATIC_FOLDER)