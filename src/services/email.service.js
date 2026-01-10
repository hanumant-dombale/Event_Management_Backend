import { transporter } from "../config/nodemailer.js";
import appConfig from "../config/appConfig.js";
import email from "../models/email.model.js";
import CustomError from "../utils/customError.js";
import { Op } from "sequelize";

const renderTemplate = (template, variables = {}) => {
  if (!template) return "";

  let rendered = template;

  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    rendered = rendered.replace(regex, String(variables[key]));
  });

  return rendered;
};

const sendEmail = async ({ to, templateKey, variables }) => {
  if (!to) throw new Error("Recipient email is required.");
  if (!templateKey) throw new Error("Template key is required.");

  const template = await email.findOne({
    where: {
      templateKey,
      isActive: true,
    },
  });

  if (!template) {
    throw new Error("Email template not found");
  }

  const subject = renderTemplate(template.subject, variables);
  const html = renderTemplate(template.htmlContent, variables);

  await transporter.sendMail({
    from: appConfig.SMTP_FROM,
    to,
    subject,
    html,
  });
};

const createEmailService = async (data) => {
  const { templateKey, subject, htmlContent } = data;

  if (!templateKey || !subject || !htmlContent) {
    throw new CustomError(
      "templateKey, subject, and htmlContent are required.",
      400,
    );
  }

  const existingTemplate = await email.findOne({
    where: { templateKey },
  });

  if (existingTemplate) {
    throw new CustomError("Template key already exists.", 400);
  }

  const template = await email.create({
    templateKey,
    subject,
    htmlContent,
  });

  return template;
};

const updateEmailService = async (id, data) => {
  if (!id) throw new CustomError("Template ID is required.", 400);

  const template = await email.findByPk(id);
  if (!template) throw new CustomError("Email template not found.", 404);

  const { templateKey, subject, htmlContent, isActive } = data;

  if (templateKey && templateKey !== template.templateKey) {
    const exists = await email.findOne({
      where: { templateKey },
    });
    if (exists) throw new CustomError("Template key already in use.", 400);
  }

  template.templateKey = templateKey ?? template.templateKey;
  template.subject = subject ?? template.subject;
  template.htmlContent = htmlContent ?? template.htmlContent;
  template.isActive = isActive ?? template.isActive;

  await template.save();
  return template;
};

const deleteEmailService = async (id) => {
  if (!id) throw new CustomError("Template ID is required.", 400);

  const template = await email.findByPk(id);
  if (!template) throw new CustomError("Email template not found.", 404);

  template.isActive = false;
  await template.save();

  return template;
};

const getEmailsService = async (query) => {
  const {
    id,
    templateKey,
    subject,
    isActive,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "DESC",
  } = query;

  const where = {};

  if (isActive !== undefined) where.isActive = isActive;
  if (id) where.id = id;
  if (templateKey) where.templateKey = { [Op.iLike]: `%${templateKey}%` };
  if (subject) where.subject = { [Op.iLike]: `%${subject}%` };

  const offset = (page - 1) * limit;

  const { rows, count } = await email.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [[sortBy, order]],
  });

  return {
    total: count,
    page: Number(page),
    totalPages: Math.ceil(count / limit),
    templates: rows,
  };
};

export {
  sendEmail,
  createEmailService,
  updateEmailService,
  deleteEmailService,
  getEmailsService,
};
