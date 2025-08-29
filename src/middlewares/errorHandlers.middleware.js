import appConfig from "../config/appConfig.js";
import CustomError from "../utils/customError.js";

const notFound = (req, res, next) => {
    const err = new CustomError(
        `Can't found ${req.method}: ${req.originalUrl} resource.`,
        404,
    );

    next(err);
};

const response = {
    dev: (res, err) => {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errorTrace: err.stack,
            error: err,
        });
    },
    prod: (res, err) => {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    },
};

const globalErrorHandle = (err, req, res, next) => {
    if (appConfig.NODE_ENV === "development") {
        return response.dev(res, err);
    }

    return response.prod(res, err);
};

const asyncErrorHandler = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((err) => next(err));
    };
};

export { notFound, globalErrorHandle, asyncErrorHandler };
