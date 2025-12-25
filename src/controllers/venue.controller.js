import { asyncErrorHandler } from "../middlewares/errorHandlers.middleware.js";
import { successResponse } from "../utils/apiResponse.js";
import {
    createVenueService,
    updateVenueService,
    deleteVenueService,
    getVenuesService,
} from "../services/venue.service.js";

// 1️⃣ Create Venue
const createVenue = asyncErrorHandler(async (req, res) => {
    const venue = await createVenueService(req.body);

    return successResponse(res, 201, "Venue created successfully.", venue);
});

// 2️⃣ Update Venue
const updateVenue = asyncErrorHandler(async (req, res) => {
    const venue = await updateVenueService(req.params.id, req.body);

    return successResponse(res, 200, "Venue updated successfully.", venue);
});

// 3️⃣ Soft Delete Venue
const deleteVenue = asyncErrorHandler(async (req, res) => {
    await deleteVenueService(req.params.id);

    return successResponse(res, 200, "Venue deleted successfully.");
});

// 4️⃣ Fetch Venues (powerful query)
const getVenues = asyncErrorHandler(async (req, res) => {
    const data = await getVenuesService(req.query);

    return successResponse(res, 200, "Venues fetched successfully.", data);
});

export { createVenue, updateVenue, deleteVenue, getVenues };
