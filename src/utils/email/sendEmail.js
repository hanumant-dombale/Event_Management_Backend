import { transporter } from "../../config/nodemailer.js";

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: appConfig.SMTP_FROM,
    to,
    subject,
    html,
  });
};

export { sendEmail };
