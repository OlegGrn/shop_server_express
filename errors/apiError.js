class ApiError extends Error{

    constructor(message, status) {
        super(message);
        this.status = status;
        this.message = message;
    }

    static badRequest(message){
        return new ApiError(message, 400)
    }
    static unauthorized(message){
        return new ApiError(message, 401)
    }

    static forbidden(message){
        return new ApiError(message, 403)
    }

    static notFound(message){
        return new ApiError(message, 404)
    }

    static serverError(message){
        return new ApiError(message, 500)
    }
}

module.exports = ApiError