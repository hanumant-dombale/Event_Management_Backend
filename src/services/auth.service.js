import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig.js";
import CustomError from "../utils/customError.js";

const loginUserService = async ({ email, password, role }) => {
  if (!email || !password || !role) {
    throw new CustomError("Email, password, and role are required.", 400);
  }

  const user = await User.findOne({ where: { email, isActive: true } });
  if (!user) throw new CustomError("User not found or inactive.", 404);

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw new CustomError("Invalid password.", 400);

  if (user.role !== role) {
    throw new CustomError("User does not have this role.", 400);
  }

  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, appConfig.JWT_SECRET, {
    expiresIn: appConfig.JWT_EXPIRES_IN,
  });

  const { password: _, ...safeUser } = user.toJSON();

  return { user: safeUser, token };
};

export { loginUserService };
