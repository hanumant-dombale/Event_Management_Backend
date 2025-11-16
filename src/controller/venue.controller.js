import { asyncErrorHandler } from "../middlewares/errorHandlers.middleware.js";
import Venue from "../models/venue.model.js";
import { successResponse } from "../utils/apiResponse.js";
import CustomError from "../utils/customError.js";

const createVenue = asyncErrorHandler(async (req, resizeBy, next) => {
    const { name, address } = req.body;
    if (!name || !address) {
        throw new CustomError("Name & address much be required.", 400);
    }

    const venue = Venue.create({ name, address });

    return successResponse(res, 200, "Venue created successfully.", venue);
});

const getAllVenue = asyncErrorHandler(async (req, res) => {
    const allVenue = await Venue.findAll();
    if (allVenue.length === 0) {
        throw new CustomError("Not have an value, first create it!", 400);
    }

    return successResponse(res, 200, "Get all venues successfully.", allVenue);
});

const getVenueById = asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new CustomError("Id much be required.", 400);
    }

    const venue = Venue.findByPk(id);

    return successResponse(res, 200, "Get venue by id successfully.");
});

const updateVenue = asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    const { name, address } = req.body;
    if (!id) {
        throw new CustomError("Id much be required.", 400);
    }

    const venue = Venue.findByPk(id);

    if (name) venue.name = name;
    if (address) venue.address = address;

    venue.save();

    return successResponse(res, 200, "Update information successfully.", venue);
});

const deleteVenue = asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new CustomError("Id much be required.", 400);
    }

    const venue = Venue.findByPk(id);

    return successResponse(res, 200, "Delete venue successfully.", venue);
});

const getEventByVenue = asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new CustomError("Id much be required.", 400);
    }

    const venue = Venue.findByPk(id, {
        include: ["Events"],
    });

    return successResponse(res, 200, "Get event by venue.", venue.Events);
});

export {
    createVenue,
    getAllVenue,
    getEventByVenue,
    getVenueById,
    updateVenue,
    deleteVenue,
};
