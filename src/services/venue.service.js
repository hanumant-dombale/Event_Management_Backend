import { Op } from "sequelize";
import Venue from "../models/venue.model.js";
import CustomError from "../utils/customError.js";

const createVenueService = async (data) => {
    const { name, street, city, state, country, zipCode } = data;

    if (!name || !street || !city || !country) {
        throw new CustomError(
            "Name, street, city, and country are required.",
            400,
        );
    }

    return await Venue.create({
        name,
        street,
        city,
        state,
        country,
        zipCode,
        isActive: true,
    });
};

const updateVenueService = async (id, data) => {
    if (!id) {
        throw new CustomError("Id must be provided.", 400);
    }

    const venue = await Venue.findByPk(id);
    if (!venue || !venue.isActive) {
        throw new CustomError("Venue not found.", 404);
    }

    const { name, street, city, state, country, zipCode } = data;

    venue.name = name || venue.name;
    venue.street = street || venue.street;
    venue.city = city || venue.city;
    venue.state = state || venue.state;
    venue.country = country || venue.country;
    venue.zipCode = zipCode || venue.zipCode;

    await venue.save();

    return venue;
};

const deleteVenueService = async (id) => {
    if (!id) {
        throw new CustomError("Id must be provided.", 400);
    }

    const venue = await Venue.findByPk(id);
    if (!venue || !venue.isActive) {
        throw new CustomError("Venue not found.", 404);
    }

    venue.isActive = false;
    await venue.save();
};

const getVenuesService = async (query) => {
    const {
        id,
        name,
        city,
        state,
        country,
        zipCode,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "DESC",
    } = query;

    const where = { isActive: true };

    if (id) where.id = id;
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (city) where.city = { [Op.iLike]: `%${city}%` };
    if (state) where.state = { [Op.iLike]: `%${state}%` };
    if (country) where.country = { [Op.iLike]: `%${country}%` };
    if (zipCode) where.zipCode = { [Op.iLike]: `%${zipCode}%` };

    const offset = (page - 1) * limit;

    const { rows, count } = await Venue.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [[sortBy, order]],
    });

    return {
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / limit),
        venues: rows,
    };
};

export {
    createVenueService,
    updateVenueService,
    deleteVenueService,
    getVenuesService,
};
