import { Router } from "express";
import {
  changePassword,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.patch("/change-password", authenticate, changePassword);

export default router;
