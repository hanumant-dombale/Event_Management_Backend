import { asyncErrorHandler } from "../middlewares/errorHandlers.middleware.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  createEventService,
  updateEventService,
  deleteEventService,
  getEventsService,
} from "../services/event.service.js";

const createEvent = asyncErrorHandler(async (req, res) => {
  const event = await createEventService(req.body, req.file);

  return successResponse(res, 201, "Event created successfully.", event);
});

const updateEvent = asyncErrorHandler(async (req, res) => {
  const event = await updateEventService(req.params.id, req.body);

  return successResponse(res, 200, "Event updated successfully.", event);
});

const deleteEvent = asyncErrorHandler(async (req, res) => {
  await deleteEventService(req.params.id);

  return successResponse(res, 200, "Event deleted successfully.");
});

const getEvents = asyncErrorHandler(async (req, res) => {
  const data = await getEventsService(req.query);

  return successResponse(res, 200, "Events fetched successfully.", data);
});

export { createEvent, updateEvent, deleteEvent, getEvents };
