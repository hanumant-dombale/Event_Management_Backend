import { DataTypes } from "sequelize";
import sequelize from "../database/connetion.js";

const Event = sequelize.define(
    "Event",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        venueId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Venues",
                key: "id",
            },
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },
    },
    {
        timestamps: true,
        tableName: "Events",
    },
);

export default Event;
