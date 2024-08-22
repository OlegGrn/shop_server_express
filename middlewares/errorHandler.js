const apiError = require('../errors/apiError')

module.exports = function (err, req, res, next) {
    if (err instanceof apiError) {
        console.log("errors : " + err.status)
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    console.log(err.status)
    console.log(err.message)

    return res.status(500).json(
        {message: `"Ошибка не обработана, message : ${err.message}, errors: ${err.errors}`}
    )

}