import { Sequelize } from "sequelize";
import appConfig from "../config/appConfig.js";

const sequelize = new Sequelize(
    appConfig.PGDATABASE,
    appConfig.PGUSER,
    appConfig.PGPASSWORD,
    {
        host: appConfig.PGHOST,
        dialect: "postgres",
        port: appConfig.PGPORT,
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
);

export default sequelize;
