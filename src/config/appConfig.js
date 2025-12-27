import DotenvFlow from "dotenv-flow";

DotenvFlow.config();

export default {
  NODE_ENV: process.env.NODE_ENV,

  PORT: process.env.PORT || 6000,
  ORIGIN: process.env.ORIGIN,

  DIALECT: process.env.DIALECT,
  PGHOST: process.env.PGHOST,
  PGDATABASE: process.env.PGDATABASE,
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGPORT: +process.env.PGPORT || 5432,
  PGSSLMODE: process.env.PGSSLMODE,
  PGCHANNELBINDING: process.env.PGCHANNELBINDING,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "2d",
  BCRYPT_SALT_ROUNDS: +process.env.BCRYPT_SALT_ROUNDS || 10,

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: +process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,

  OTP_EXPIRES_IN_MINUTES: +process.env.OTP_EXPIRES_IN_MINUTES || 10,
};
