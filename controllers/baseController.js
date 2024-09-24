


class BaseController{

    constructor(service) {
        this.service = service
    }

    async addData(req, res, next) {
        try {
            const name = req.body.name;
            await this.service.addData(name)
            return res.status(200).json({message: `${name} добавлен`})
        } catch (err) {
            next(err)
        }
    }

    async getData(req, res, next){
        try {
            const data = await this.service.getData()
            return res.status(200).json(data)

        } catch (err){
            next(err)
        }
    }


    async deleteData(req, res, next) {
        try {
            const id = req.body.id
            await this.service.deleteData(id)
            return res.status(200).json({message: "Удалено"})

        } catch (err) {
            next(err)
        }
    }
    async getUnique(req, res, next) {
        try {
            const data = await this.service.getUnique()
            return res.status(200).json(data)
        } catch (err) {
            next(err)
        }
    }

}

module.exports = BaseController