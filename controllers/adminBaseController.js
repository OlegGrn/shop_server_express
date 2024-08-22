const BaseController = require("./BaseController");
const AdminService = require('../services/adminService')



class AdminBaseController extends BaseController{
    constructor(service) {
        super(service);
    }
}

module.exports = new AdminBaseController(AdminService)




