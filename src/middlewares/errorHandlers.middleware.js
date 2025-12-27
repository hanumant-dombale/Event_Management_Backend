import appConfig from "../config/appConfig.js";
import CustomError from "../utils/customError.js";

export const notFound = (req, res, next) => {
  const err = new CustomError(
    `Can't found ${req.method}: ${req.originalUrl} resource.`,
    404,
  );
  next(err);
};

const response = {
  dev: (res, err) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong",
      error: err,
      errorTrace: err.stack,
    });
  },
  prod: (res, err) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  },
};

export const globalErrorHandle = (err, req, res, next) => {
  if (appConfig.NODE_ENV === "development") {
    console.error(`${err.name}: ${err.message}`);
    return response.dev(res, err);
  }

  return response.prod(res, err);
};

export const asyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};
