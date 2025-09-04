import DotenvFlow from "dotenv-flow";

DotenvFlow.config();

export default {
    NODE_ENV: process.env.NODE_ENV,

    PORT: process.env.PORT | 6000,
    ORIGIN: process.env.ORIGIN,

    DIALECT: process.env.DIALECT,
    PGHOST: process.env.PGHOST,
    PGDATABASE: process.env.PGDATABASE,
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    PGPORT: process.env.PGPORT | 5432,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN | "2d",
};
