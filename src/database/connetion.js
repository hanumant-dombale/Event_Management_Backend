import { Sequelize } from "sequelize";
import appConfig from "../config/appConfig.js";

const sequelize = new Sequelize(
    appConfig.PGDATABASE,
    appConfig.PGUSER,
    appConfig.PGPASSWORD,
    {
        host: appConfig.PGHOST,
        dialect: appConfig.DIALECT,
        port: appConfig.PGPORT,
        logging: false,
        dialectOptions:
            appConfig.NODE_ENV === "production"
                ? {
                      ssl: {
                          require: true,
                          rejectUnauthorized: false,
                      },
                  }
                : { ssl: false },
    },
);

export default sequelize;
//  dialectOptions: {
//             ssl: {
//                 require: false,
//                 rejectUnauthorized: false,
//             },
//         },
//         dialectOptions: {
//             ssl: false,
//         },
