import { Router } from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
} from "../controllers/events.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getEvents);
router.post("/", authenticate, createEvent);

router.put("/:id", authenticate, updateEvent);
router.delete("/:id", authenticate, deleteEvent);

export default router;
