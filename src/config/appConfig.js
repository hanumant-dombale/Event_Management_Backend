import DotenvFlow from "dotenv-flow";

DotenvFlow.config();

export default {
    ENV: process.env.ENV,

    PORT: process.env.PORT | 6000,
    SERVER_URI: process.env.SERVER_URI,
    ORIGIN: process.env.ORIGIN,

    PGHOST: process.env.PGHOST,
    PGDATABASE: process.env.PGDATABASE,
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    PGPORT: process.env.PGPORT | 5432,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN | "2d",
};
