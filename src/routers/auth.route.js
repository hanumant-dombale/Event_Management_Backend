import { Router } from "express";
import {
  changePassword,
  forgotPasswordRequest,
  loginUser,
  logoutUser,
  resetPasswordWithOtp,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.patch("/change-password", authenticate, changePassword);
router.post("/forgot-password", forgotPasswordRequest);
router.patch("/reset-password", resetPasswordWithOtp);

export default router;
