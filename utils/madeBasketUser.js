module.exports = function (response) {

    return response.map(field => {
        return {
            id: field.id,
            id_user: field.id_user,
            id_device: field.id_device,
            device: field.device.name,
            price: field.device.price,

            size_id: field.id_size,

            quantity_all: field.device.sizes
                .find(item => item.id === field.id_size)
                .sizeDevice.quantity,

            size_name: field.size.name,
            quantity_chosen: field.quantity_chosen,
            paid: field.paid
        }
    })
}