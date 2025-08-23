import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

// Create the new user
const register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        if (!name || !email || !password) {
            errorResponse(res, 400, "All info is required", null);
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            errorResponse(res, 400, "User does't exist with this email.", null);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || "participant",
        });

        // Create JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            appConfig.JWT_SECRET,
            { expiresIn: appConfig.JWT_EXPIRES_IN },
        );

        // Clean user data before sending
        const { password: _, ...userData } = user.toJSON();

        successResponse(res, 200, "New user created successfully.", userData);
    } catch (error) {
        console.error("Register Error:", error);
        errorResponse(res, 500, "Internal server error.", error);
    }
};

export { register };
