import { Router } from "express";
import {
    registerUser,
    login,
    logout,
    updateUser,
    forgotPassword,
    getAllUser,
    getUserById,
    deleteUser,
} from "../controller/users.controller.js";

const router = Router();

router.route("/:id").get(getUserById);
router.route("/").get(getAllUser);

router.route("/:id/change-password").post(forgotPassword);
router.route("/register").post(registerUser);
router.route("/logout").post(logout);
router.route("/login").post(login);

router.route("/:id").put(updateUser);

router.route("/:id").delete(deleteUser);

export default router;
