

module.exports = function (response){

    let newSizes = response.sizes.map(size => {
        return {
            sizeID: size.id,
            deviceId: size.sizeDevice.id_device,
            sizeName: size.name,
            quantity: size.sizeDevice.quantity
        }
    })

    let newPaths = response.paths.map(path => {
        return {
            idPath: path.id,
            idDevice: path.id_device,
            pathName: path.name,
            pathNameUrl: `${path.id_device}/${path.name}`
        }
    })

    return {
        id: response.id,
        name: response.name,
        price: response.price,
        description: response.description,
        img: response.img,
        sizes: newSizes,
        type: response.type.name,
        category: response.category.name,
        id_category: response.id_category,
        id_type: response.id_type,
        paths: newPaths
    }
}