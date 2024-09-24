const BasketService = require("../services/basketService")

class BasketController {

    async addData(req, res, next) {

        try {
            let result = await BasketService.addData(req.body)
            return res.status(200).json({message: JSON.stringify(result)})

        } catch (err) {
            next(err)
        }
    }

    async deleteData(req, res, next) {
        try {
            await BasketService.deleteData(req.body)
            return res.status(200).json({message: "delete Ok"})

        } catch (err) {
            next(err)
        }
    }

    async getDataUser(req, res, next) {
        try {
            const result = await BasketService.getDataUser(req.params.id_user)
            return res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }

    async updateOrder(req, res, next){
        try{
            //response массив:  [1] -ok, [0] - false
            let response = await BasketService.updateOrder(req.body)
            if(response.includes(1)){
                return res.status(201).json({message: true})
            } else {
                return res.status(200).json({message: false})
            }
        } catch (err){
            next(err)
        }
    }

}

module.exports = new BasketController()