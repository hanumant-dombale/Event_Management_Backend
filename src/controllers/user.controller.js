import { asyncErrorHandler } from "../middlewares/errorHandlers.middleware.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  createUserService,
  updateUserService,
  deleteUserService,
  getUsersService,
} from "../services/user.service.js";

const createUser = asyncErrorHandler(async (req, res) => {
  const user = await createUserService(req.body);
  return successResponse(res, 201, "User created successfully.", user);
});

const updateUser = asyncErrorHandler(async (req, res) => {
  const user = await updateUserService(req.params.id, req.body);
  return successResponse(res, 200, "User updated successfully.", user);
});

const deleteUser = asyncErrorHandler(async (req, res) => {
  const user = await deleteUserService(req.params.id);
  return successResponse(res, 200, "User soft-deleted successfully.", user);
});

const getAllUsers = asyncErrorHandler(async (req, res) => {
  const data = await getUsersService(req.query);
  return successResponse(res, 200, "Users fetched successfully.", data);
});

export { createUser, updateUser, deleteUser, getAllUsers };
