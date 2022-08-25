class AppError extends Error{
    constructor(statusCode, message) {
        super(message);

        this.statusCode = statusCode;
        this.status = false;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;