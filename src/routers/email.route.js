import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  getAllEmailTemplates,
} from "../controllers/email.controller.js";

const router = Router();

router.route("/").get(authenticate, getAllEmailTemplates);
router.route("/").post(authenticate, createEmailTemplate);

router.route("/:id").put(authenticate, updateEmailTemplate);
router.route("/:id").delete(authenticate, deleteEmailTemplate);

export default router;
