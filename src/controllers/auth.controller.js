import { asyncErrorHandler } from "../middlewares/errorHandlers.middleware.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  changePasswordService,
  forgotPasswordRequestService,
  loginUserService,
  resetPasswordWithOtpService,
} from "../services/auth.service.js";
import appConfig from "../config/appConfig.js";

const loginUser = asyncErrorHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const { user, token } = await loginUserService({ email, password, role });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return successResponse(res, 200, "User logged in successfully.", {
    user,
    token,
  });
});

const logoutUser = asyncErrorHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: appConfig.NODE_ENV === "production",
    sameSite: appConfig.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  });

  return successResponse(res, 200, "User logged out successfully.");
});

const changePassword = asyncErrorHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  await changePasswordService(userId, {
    currentPassword,
    newPassword,
  });

  return successResponse(res, 200, "Password updated successfully.");
});

const forgotPasswordRequest = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;

  await forgotPasswordRequestService(email);

  return successResponse(res, 200, "OTP sent to your registered email.");
});

const resetPasswordWithOtp = asyncErrorHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  await resetPasswordWithOtpService({ email, otp, newPassword });

  return successResponse(res, 200, "Password reset successfully.");
});

export {
  loginUser,
  logoutUser,
  changePassword,
  forgotPasswordRequest,
  resetPasswordWithOtp,
};
