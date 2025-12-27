import { asyncErrorHandler } from "../middlewares/errorHandlers.middleware.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  changePasswordService,
  loginUserService,
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

export { loginUser, logoutUser, changePassword };
