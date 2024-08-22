const TypeService = require('../services/typeService')
const BaseController = require("./BaseController");



class TypeBaseController extends BaseController{
    constructor(service) {
        super(service);
    }
}

module.exports = new TypeBaseController(TypeService)




