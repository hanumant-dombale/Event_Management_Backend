import { Router } from "express";
import {
    createVenue,
    deleteVenue,
    getAllVenue,
    getEventByVenue,
    getVenueById,
    updateVenue,
} from "../controller/venue.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:id/events").get(authenticate, getEventByVenue);
router.route("/").get(authenticate, getAllVenue);

router.route("/").post(authenticate, createVenue);
router.route("/:id").get(authenticate, getVenueById);

router.route("/:id").put(authenticate, updateVenue);

router.route("/:id").delete(authenticate, deleteVenue);

export default router;
