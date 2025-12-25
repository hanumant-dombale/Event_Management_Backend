import { Router } from "express";
import {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/").get(getAllUsers);

router.route("/register").post(createUser);

router.route("/:id").put(updateUser);

router.route("/:id").delete(deleteUser);

export default router;
