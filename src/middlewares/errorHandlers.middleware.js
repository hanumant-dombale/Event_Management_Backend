import CustomError from "../utils/customError.js";

const notFound = (req, res, next) => {
    const err = new CustomError(
        `Can't found ${req.method}: ${req.originalUrl} resource.`,
        404,
        "NOT_FOUND",
    );

    next(err);
};

const globalErrorHandle = (err, req, res, next) => {
    const error = {
        success: false,
        message: err.message,
        errorCode: err.errorCode,
    };

    return res.status(err.statusCode).json(error);
};

const asyncErrorHandler = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((err) => next(err));
    };
};

export { notFound, globalErrorHandle, asyncErrorHandler };
