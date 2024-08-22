const { Role} = require('../models/allModels')

module.exports = async function (id,email) {
    const roles = await Role
        .findAll({where: {id_user: id}})
        .then((all_roles) => all_roles.map(role => role.name))

    return {id, email, roles}
}

