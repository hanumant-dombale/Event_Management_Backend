import nodemailer from "nodemailer";
import appConfig from "../../config/appConfig.js";

const transporter = nodemailer.createTransport({
  host: appConfig.SMTP_HOST,
  port: appConfig.SMTP_PORT,
  secure: appConfig.SMTP_SECURE,
  auth: {
    user: appConfig.SMTP_USER,
    pass: appConfig.SMTP_PASS,
  },
});

export { transporter };
