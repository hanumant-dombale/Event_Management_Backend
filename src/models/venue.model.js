import { DataTypes } from "sequelize";
import sequelize from "../database/connetion.js";

const Venue = sequelize.define(
    "Venue",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: true,
        tableName: "Venues",
    },
);

export default Venue;
