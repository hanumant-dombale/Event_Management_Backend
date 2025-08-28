class CustomError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.errorCode = errorCode;

        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;
