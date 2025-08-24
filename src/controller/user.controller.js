import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

// Create the new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        if (!name || !email || !password) {
            return errorResponse(res, 400, "All info is required");
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return errorResponse(res, 400, "User exist with this email.");
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
    } catch (error) {
        console.error("Register Error:", error);
        return errorResponse(
            res,
            500,
            "Internal server error while register new user.",
            error,
        );
    }
};

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return errorResponse(res, 400, "All data is required.");
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return errorResponse(res, 400, "User not found with email.");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return errorResponse(res, 400, "Invalid password.");
        }

        if (role !== user.role) {
            return errorResponse(res, 400, "User does't exist with this role.");
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
    } catch (error) {
        console.log("Login Error: ", error);
        return errorResponse(
            res,
            500,
            "Internal server error while login user.",
            error,
        );
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: appConfig.NODE_ENV === "production" ? true : false,
            sameSite: appConfig.NODE_ENV === "production" ? "None" : "Lax",
            path: "/",
        });

        return successResponse(res, 200, "User logout successfully.");
    } catch (error) {
        console.log("Logout Error: ", error);
        return errorResponse(
            res,
            500,
            "Internal server error while logout user.",
            error,
        );
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return errorResponse(res, 400, "User not found.");
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return errorResponse(res, 400, "Email already in use.");
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
    } catch (error) {
        console.log("Update User Error: ", error);
        return errorResponse(
            res,
            500,
            "Internal server error while update user.",
            error,
        );
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return errorResponse(res, 400, "Both are required.");
        }

        const user = await User.findByPk(id);
        if (!user) {
            return errorResponse(res, 400, "User not found.");
        }

        const isCurrentPasswordMatch = await bcrypt.compare(
            currentPassword,
            user.password,
        );
        if (!isCurrentPasswordMatch) {
            return errorResponse(res, 400, "Current Password does not match.");
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;

        await user.save();

        return successResponse(res, 200, "Forgot password successfully.");
    } catch (error) {
        console.log("Forgot Password Error: ", error);
        return errorResponse(
            res,
            500,
            "Internal server error while forgot password.",
            error,
        );
    }
};

const getAllUser = async (req, res) => {
    try {
        const allUser = await User.findAll();
        if (allUser.length === 0) {
            return errorResponse(res, 400, "No user found.");
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
    } catch (error) {
        console.log("Get All User Error: ", error);
        return errorResponse(
            res,
            500,
            "Internal server error while getting all user",
            error,
        );
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return errorResponse(res, 400, "User not found by this id.");
        }

        const { password: _, ...safeUser } = user.toJSON();

        return successResponse(
            res,
            200,
            "Get user by id successfully.",
            safeUser,
        );
    } catch (error) {
        console.log("Get User By Id Error: ", error);
        return errorResponse(
            res,
            500,
            "Internal server error while getting user by id.",
            error,
        );
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return errorResponse(res, 400, "User not found.");
        }

        await user.destroy();

        const { password: _, ...safeUser } = user.toJSON();

        return successResponse(res, 200, "User delete successfully.", safeUser);
    } catch (error) {
        console.log("Delete User Error: ", error);
        return errorResponse(
            res,
            500,
            "Internal server error while deleting user.",
            error,
        );
    }
};

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
