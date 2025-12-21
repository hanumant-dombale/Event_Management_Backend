import asyncErrorHandler from "../middlewares/errorHandlers.middleware.js";
import CustomError from "../utils/customError.js";

const createEvent = asyncErrorHandler(async (req, res, next) => {
    const { title, description, date, venueId, createdBy } = req.body;
    if (!title || !date || !venueId) {
        throw new CustomError("Title, date much be required.");
    }
});
