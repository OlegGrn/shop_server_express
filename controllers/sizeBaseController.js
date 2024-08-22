
const SizeService = require('../services/sizeService')
const BaseController = require("./BaseController");



class SizeBaseController extends BaseController{
    constructor(service) {
        super(service);
    }


}

module.exports = new SizeBaseController(SizeService)


