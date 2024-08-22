const CategoryService = require('../services/categoryService')
const BaseController = require("./BaseController");



class CategoryBaseController extends BaseController{
     constructor(service) {
         super(service);
     }



}

module.exports = new CategoryBaseController(CategoryService)


