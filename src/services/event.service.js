import { Op } from "sequelize";
import Event from "../models/event.model.js";
import Venue from "../models/venue.model.js";
import CustomError from "../utils/customError.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import {
  createVenueService,
  deleteVenueService,
  updateVenueService,
} from "./venue.service.js";

const createEventService = async (data, file) => {
  const {
    title,
    description,
    date,
    startTime,
    endTime,
    createdBy,
    status,
    capacity,
    ticketPrice,
    contactEmail,
    contactPhone,
    venue,
  } = data;

  if (!title || !date || !createdBy || !venue) {
    throw new CustomError("Required fields are missing.", 400);
  }

  const venueEntity = await createVenueService(venue);

  let imageUrl = null;
  if (file) {
    imageUrl = await uploadToCloudinary(file.path);
  }

  const event = await Event.create({
    title,
    description,
    date,
    startTime,
    endTime,
    createdBy,
    venueId: venueEntity.id,
    status,
    capacity,
    ticketPrice,
    contactEmail,
    contactPhone,
    image: imageUrl,
    isActive: true,
  });

  return {
    ...event.toJSON(),
    venue: venueEntity.toJSON(),
  };
};

const updateEventService = async (id, data, file) => {
  console.log("updateEventService");

  const event = await Event.findByPk(id);

  if (!event || !event.isActive) {
    throw new CustomError("Event not found.", 404);
  }

  const {
    title,
    description,
    date,
    startTime,
    endTime,
    status,
    capacity,
    ticketPrice,
    contactEmail,
    contactPhone,
    venue,
    isActive,
  } = data;

  let updatedVenue = null;
  if (venue) {
    updatedVenue = await updateVenueService(event.venueId, venue);
  }

  if (file) {
    const imageUrl = await uploadToCloudinary(file.path);
    event.image = imageUrl;
  }

  if (title !== undefined) event.title = title;
  if (description !== undefined) event.description = description;
  if (date !== undefined) event.date = date;
  if (startTime !== undefined) event.startTime = startTime;
  if (endTime !== undefined) event.endTime = endTime;
  if (status !== undefined) event.status = status;
  if (capacity !== undefined) event.capacity = capacity;
  if (ticketPrice !== undefined) event.ticketPrice = ticketPrice;
  if (contactEmail !== undefined) event.contactEmail = contactEmail;
  if (contactPhone !== undefined) event.contactPhone = contactPhone;
  if (isActive !== undefined) event.isActive = isActive;

  await event.save();

  return {
    ...event.toJSON(),
    venue: updatedVenue ? updatedVenue.toJSON() : undefined,
  };
};

const deleteEventService = async (id) => {
  if (!id) {
    throw new CustomError("Event id is required.", 400);
  }

  const event = await Event.findOne({
    where: { id, isActive: true },
  });

  if (!event) {
    throw new CustomError("Event not found.", 404);
  }

  if (event.venueId) {
    await deleteVenueService(event.venueId);
  }

  event.isActive = false;
  await event.save();

  return {
    message: "Event and associated venue deleted successfully.",
  };
};

const getEventsService = async (query) => {
  console.log("getEventsService");

  const {
    id,
    title,
    description,
    date,
    startTime,
    endTime,
    createdBy,
    status,
    capacity,
    ticketPrice,
    contactEmail,
    contactPhone,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "DESC",
  } = query;

  // 1. WHERE condition (same pattern as venues)
  const where = { isActive: true };

  if (id) where.id = id;
  if (title) where.title = { [Op.iLike]: `%${title}%` };
  if (description) where.description = { [Op.iLike]: `%${description}%` };
  if (date) where.date = date;
  if (startTime) where.startTime = startTime;
  if (endTime) where.endTime = endTime;
  if (createdBy) where.createdBy = createdBy;
  if (status) where.status = status;
  if (capacity) where.capacity = capacity;
  if (ticketPrice) where.ticketPrice = ticketPrice;
  if (contactEmail) where.contactEmail = { [Op.iLike]: `%${contactEmail}%` };
  if (contactPhone) where.contactPhone = { [Op.iLike]: `%${contactPhone}%` };

  const offset = (page - 1) * limit;

  const { rows, count } = await Event.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [[sortBy, order]],
    include: [
      {
        model: Venue,
        as: "Venue",
        required: false,
        where: { isActive: true },
      },
    ],
  });

  return {
    total: count,
    page: Number(page),
    totalPages: Math.ceil(count / limit),
    events: rows,
  };
};

export {
  createEventService,
  updateEventService,
  deleteEventService,
  getEventsService,
};
