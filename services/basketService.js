const {GeneralBasket, Size, Device} = require("../models/allModels");
const madeBasketUser = require("../utils/madeBasketUser")

class BasketService {

    async addData(reqBody) {
        //ищем в БД аналогичный товар по ID_size, id_user, id_size
        //если находим, обновляем количество quantity_chosen
        //если нет, делаем новую запись

        const id_user = reqBody.id_user
        const id_device = reqBody.id_device
        const id_size = reqBody.id_size
        const quantity_chosen = reqBody.quantity_chosen


        const candidate = await GeneralBasket.findOne({
            where: {id_user, id_device, id_size}
        })
        if (candidate) {
            candidate.quantity_chosen += quantity_chosen
            await candidate.save()
            return candidate
        } else {
            return await GeneralBasket.create({
                id_user, id_device, id_size, quantity_chosen
            })
        }
    }

    async deleteData(reqBody) {
        await GeneralBasket.destroy({
            where: {
                id: reqBody.id
            }
        })
    }
    async updateOrder(reqBody){
        const {quantity, id_order} = reqBody;

        //return [1] -ok, [0] - false
        return  await GeneralBasket.update({
            quantity_chosen: quantity
        }, {
            where: {
                id: id_order
            }
        })
    }


    //получаем все записи из корзины по данному юзеру
    async getDataUser(id_user) {
        let response = await GeneralBasket.findAll({
            where: {id_user},
            include: [
                {
                    model: Device,
                    include: [Size]
                },
                Size
            ]
        })
        //если пусто в response, то на выходe []
        return response.length > 0 ? madeBasketUser(response) : []
        //return response
    }

}


module.exports = new BasketService()