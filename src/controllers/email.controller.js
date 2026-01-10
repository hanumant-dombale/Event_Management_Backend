import { asyncErrorHandler } from "../middlewares/errorHandlers.middleware.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  createEmailService,
  updateEmailService,
  deleteEmailService,
  getEmailsService,
} from "../services/email.service.js";

const createEmailTemplate = asyncErrorHandler(async (req, res) => {
  const template = await createEmailService(req.body);
  return successResponse(
    res,
    201,
    "Email template created successfully.",
    template,
  );
});

const updateEmailTemplate = asyncErrorHandler(async (req, res) => {
  const template = await updateEmailService(req.params.id, req.body);
  return successResponse(
    res,
    200,
    "Email template updated successfully.",
    template,
  );
});

const deleteEmailTemplate = asyncErrorHandler(async (req, res) => {
  const template = await deleteEmailService(req.params.id);
  return successResponse(
    res,
    200,
    "Email template deleted successfully.",
    template,
  );
});

const getAllEmailTemplates = asyncErrorHandler(async (req, res) => {
  const data = await getEmailsService(req.query);
  return successResponse(
    res,
    200,
    "Email templates fetched successfully.",
    data,
  );
});

export {
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  getAllEmailTemplates,
};
