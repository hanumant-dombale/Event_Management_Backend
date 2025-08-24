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
} from "../controller/user.controller.js";

const router = Router();

router.route("/get-user-by-id/:id").get(getUserById);
router.route("/get-all-user").get(getAllUser);

router.route("/forgot-password/:id").post(forgotPassword);
router.route("/register").post(registerUser);
router.route("/logout").post(logout);
router.route("/login").post(login);

router.route("/update/:id").put(updateUser);

router.route("/delete/:id").delete(deleteUser);

export default router;
