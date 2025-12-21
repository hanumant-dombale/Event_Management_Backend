import { asyncErrorHandler } from "../middlewares/errorHandlers.middleware.js";
import Venue from "../models/venue.model.js";
import { successResponse } from "../utils/apiResponse.js";
import CustomError from "../utils/customError.js";

const createVenue = asyncErrorHandler(async (req, res, next) => {
    const { name, street, city, state, country, zipCode } = req.body;

    if (!name || !street || !city || !country) {
        throw new CustomError(
            "Name, street, city, and country are required.",
            400,
        );
    }

    const venue = await Venue.create({
        name,
        street,
        city,
        state,
        country,
        zipCode,
    });

    return successResponse(res, 201, "Venue created successfully.", venue);
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

    const venue = await Venue.findByPk(id);
    if (!venue) {
        throw new CustomError("Venue not found.", 404);
    }

    return successResponse(res, 200, "Get venue by id successfully.", venue);
});

const updateVenue = asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    const { name, street, city, state, country, zipCode } = req.body;

    if (!id) {
        throw new CustomError("Id must be provided.", 400);
    }

    const venue = await Venue.findByPk(id);
    if (!venue) {
        throw new CustomError("Venue not found.", 404);
    }

    venue.name = name || venue.name;
    venue.street = street || venue.street;
    venue.city = city || venue.city;
    venue.state = state || venue.state;
    venue.country = country || venue.country;
    venue.zipCode = zipCode || venue.zipCode;

    await venue.save();

    return successResponse(res, 200, "Venue updated successfully.", venue);
});

const deleteVenue = asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new CustomError("Id much be required.", 400);
    }

    const venue = await Venue.findByPk(id);
    if (!venue) {
        throw new CustomError("Venue not found.", 404);
    }
    await venue.destroy();

    return successResponse(res, 200, "Delete venue successfully.");
});

const getEventByVenue = asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new CustomError("Id much be required.", 400);
    }

    const venue = await Venue.findByPk(id, {
        include: ["Events"],
    });
    if (!venue) {
        throw new CustomError("Venue not found.", 404);
    }

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
