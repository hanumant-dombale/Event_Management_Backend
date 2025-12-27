import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import CustomError from "../utils/customError.js";
import { Op } from "sequelize";

const createUserService = async (data) => {
  const { name, email, password, phone, role, profileImage } = data;

  if (!name || !email || !password) {
    throw new CustomError("Name, email, and password are required.", 400);
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new CustomError("User already exists with this email.", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: role || "participant",
    profileImage,
  });

  const { password: _, ...safeUser } = user.toJSON();
  return safeUser;
};

const updateUserService = async (id, data) => {
  if (!id) throw new CustomError("User ID is required.", 400);

  const user = await User.findByPk(id);
  if (!user) throw new CustomError("User not found.", 404);

  const { name, email, phone, role, profileImage } = data;

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new CustomError("Email already in use.", 400);
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.role = role || user.role;
  user.profileImage = profileImage || user.profileImage;

  await user.save();

  const { password: _, ...safeUser } = user.toJSON();
  return safeUser;
};

const deleteUserService = async (id) => {
  if (!id) throw new CustomError("User ID is required.", 400);

  const user = await User.findByPk(id);
  if (!user) throw new CustomError("User not found.", 404);

  user.isActive = false;
  await user.save();

  const { password: _, ...safeUser } = user.toJSON();
  return safeUser;
};

const getUsersService = async (query) => {
  const {
    id,
    name,
    email,
    role,
    phone,
    profileImage,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "DESC",
  } = query;

  const where = { isActive: true };

  if (id) where.id = id;
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (email) where.email = { [Op.iLike]: `%${email}%` };
  if (role) where.role = role;
  if (phone) where.phone = { [Op.iLike]: `%${phone}%` };
  if (profileImage) where.profileImage = { [Op.iLike]: `%${profileImage}%` };

  const offset = (page - 1) * limit;

  const { rows, count } = await User.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [[sortBy, order]],
  });

  const safeUsers = rows.map(({ password, ...rest }) => rest);

  return {
    total: count,
    page: Number(page),
    totalPages: Math.ceil(count / limit),
    users: safeUsers,
  };
};

export {
  createUserService,
  updateUserService,
  deleteUserService,
  getUsersService,
};
