


module.exports = function (response) {

    return{
        count: response.count,
        rows: response.rows.map(device => {
            return{
                id: device.id,
                name: device.name,
                price: device.price,
                img: device.img,
                id_category: device.id_category,
                id_type: device.id_type,
                type: device.type.name,
                category: device.category.name,
                sizes: device.sizes.map(size => size.name),
                paths: device.paths.map(path => {
                    return {
                        idPath: path.id,
                        idDevice: path.id_device,
                        pathName: path.name,
                        pathNameUrl: `${path.id_device}/${path.name}`
                    }
                })
            }

        })
    }
}