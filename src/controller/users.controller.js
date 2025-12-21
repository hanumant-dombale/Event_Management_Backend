import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncErrorHandler } from "../middlewares/errorHandlers.middleware.js";
import CustomError from "../utils/customError.js";

// Create the new user
const registerUser = asyncErrorHandler(async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
        throw new CustomError("All filed are required.", 400);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new CustomError("User exist with this email.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || "participant",
    });

    // Clean user data before sending
    const { password: _, ...userData } = user.toJSON();

    return successResponse(
        res,
        200,
        "New user created successfully.",
        userData,
    );
});

const login = asyncErrorHandler(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        throw new CustomError("All data is required.", 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new CustomError("User not found with email.", 400);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new CustomError("Invalid password.", 400);
    }

    if (role !== user.role) {
        throw new CustomError("User does't exist with this role.", 400);
    }

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const token = jwt.sign(payload, appConfig.JWT_SECRET, {
        expiresIn: appConfig.JWT_EXPIRES_IN,
    });

    // ✅ Set cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: appConfig.NODE_ENV === "production" ? true : false,
        sameSite: appConfig.NODE_ENV === "production" ? "None" : "Lax",
    });

    // ✅ Remove password before sending response
    const { password: _, ...safeUser } = user.toJSON();

    return successResponse(res, 201, "User login successfully.", {
        user: safeUser,
        token,
    });
});

const logout = asyncErrorHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: appConfig.NODE_ENV === "production" ? true : false,
        sameSite: appConfig.NODE_ENV === "production" ? "None" : "Lax",
        path: "/",
    });

    return successResponse(res, 200, "User logout successfully.");
});

const updateUser = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
        throw new CustomError("User not found.", 400);
    }

    if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new CustomError("Email already in use.", 400);
        }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    const updateUser = await User.findByPk(id);

    const { password: _, ...safeUser } = user.toJSON();

    return successResponse(
        res,
        200,
        "Information update successfully.",
        safeUser,
    );
});

const forgotPassword = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        throw new CustomError("Both are required.", 400);
    }

    const user = await User.findByPk(id);
    if (!user) {
        throw new CustomError("User not found.", 400);
    }

    const isCurrentPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password,
    );
    if (!isCurrentPasswordMatch) {
        throw new CustomError("Current Password does not match.", 400);
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;

    await user.save();

    return successResponse(res, 200, "Forgot password successfully.");
});

const getAllUser = asyncErrorHandler(async (req, res) => {
    const allUser = await User.findAll();
    if (allUser.length === 0) {
        throw new CustomError("No user found.", 400);
    }

    const safeAllUser = allUser.map((user) => {
        const { password, ...safeUser } = user.toJSON();
        return safeUser;
    });

    return successResponse(
        res,
        200,
        "Get all users successfully.",
        safeAllUser,
    );
});

const getUserById = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
        throw new CustomError("User not found by this id.", 400);
    }

    const { password: _, ...safeUser } = user.toJSON();

    return successResponse(res, 200, "Get user by id successfully.", safeUser);
});

const deleteUser = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
        throw new CustomError("User not found.", 400);
    }

    await user.destroy();

    const { password: _, ...safeUser } = user.toJSON();

    return successResponse(res, 200, "User delete successfully.", safeUser);
});

export {
    registerUser,
    login,
    logout,
    updateUser,
    forgotPassword,
    getAllUser,
    getUserById,
    deleteUser,
};
