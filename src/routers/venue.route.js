import { Router } from "express";
import {
    createVenue,
    updateVenue,
    deleteVenue,
    getVenues,
} from "../controllers/venue.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(authenticate, getVenues);

router.route("/").post(authenticate, createVenue);

router.route("/:id").put(authenticate, updateVenue);

router.route("/:id").delete(authenticate, deleteVenue);

export default router;
