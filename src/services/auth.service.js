import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";
import appConfig from "../config/appConfig.js";
import CustomError from "../utils/customError.js";
import { sendEmail } from "../utils/email/sendEmail.js";

const generateOtp = () => randomInt(100000, 999999).toString();

const hashValue = async (value) =>
  bcrypt.hash(value, appConfig.BCRYPT_SALT_ROUNDS);

const compareValue = async (value, hash) => bcrypt.compare(value, hash);

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    appConfig.JWT_SECRET,
    { expiresIn: appConfig.JWT_EXPIRES_IN },
  );

const getActiveUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email, isActive: true } });
  if (!user) throw new CustomError("User not found.", 404);
  return user;
};

const getActiveUserById = async (id) => {
  const user = await User.findOne({ where: { id, isActive: true } });
  if (!user) throw new CustomError("User not found.", 404);
  return user;
};

const loginUserService = async ({ email, password, role }) => {
  if (!email || !password || !role) {
    throw new CustomError("Email, password, and role are required.", 400);
  }

  const user = await getActiveUserByEmail(email);

  const isPasswordMatch = await compareValue(password, user.password);
  if (!isPasswordMatch) throw new CustomError("Invalid password.", 400);

  if (user.role !== role) {
    throw new CustomError("User does not have this role.", 400);
  }

  const token = generateToken(user);
  const { password: _, ...safeUser } = user.toJSON();

  return { user: safeUser, token };
};

const changePasswordService = async (
  userId,
  { currentPassword, newPassword },
) => {
  if (!currentPassword || !newPassword) {
    throw new CustomError(
      "Current password and new password are required.",
      400,
    );
  }

  const user = await getActiveUserById(userId);

  const isPasswordMatch = await compareValue(currentPassword, user.password);
  if (!isPasswordMatch) {
    throw new CustomError("Current password is incorrect.", 401);
  }

  const isSamePassword = await compareValue(newPassword, user.password);
  if (isSamePassword) {
    throw new CustomError(
      "New password must be different from the current password.",
      400,
    );
  }

  user.password = await hashValue(newPassword);
  await user.save();

  return { message: "Password updated successfully." };
};

const forgotPasswordRequestService = async (email) => {
  if (!email) {
    throw new CustomError("Email is required.", 400);
  }

  const user = await getActiveUserByEmail(email);

  const otp = generateOtp();

  user.resetOtp = await hashValue(otp);
  user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();
  await sendEmail(user.email, otp);

  return true;
};

const resetPasswordWithOtpService = async ({ email, otp, newPassword }) => {
  if (!email || !otp || !newPassword) {
    throw new CustomError("All fields are required.", 400);
  }

  const user = await getActiveUserByEmail(email);

  if (!user.resetOtp || Date.now() > user.resetOtpExpiry) {
    throw new CustomError("OTP expired or invalid.", 400);
  }

  const isOtpValid = await compareValue(otp, user.resetOtp);
  if (!isOtpValid) {
    throw new CustomError("Invalid OTP.", 400);
  }

  user.password = await hashValue(newPassword);
  user.resetOtp = null;
  user.resetOtpExpiry = null;

  await user.save();

  return true;
};

export {
  loginUserService,
  changePasswordService,
  forgotPasswordRequestService,
  resetPasswordWithOtpService,
};
