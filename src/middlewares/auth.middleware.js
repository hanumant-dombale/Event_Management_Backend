import CustomError from "../utils/customError.js";
import jwt from "jsonwebtoken";
import { asyncErrorHandler } from "./errorHandlers.middleware.js";

// ✅ Authentication middleware
export const authenticate = asyncErrorHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        throw new CustomError("User not Authenticated.", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        throw new CustomError("Invailed token", 401);
    }

    req.user = decoded;
    next();
});

// ✅ Role-based authorization middleware
export const authorizeRoles = asyncErrorHandler(async (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new CustomError("Not authenticated", 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new CustomError("Not valid role", 403);
        }

        next();
    };
});
