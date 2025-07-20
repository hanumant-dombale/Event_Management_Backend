import { DataTypes } from "sequelize";
import sequelize from "../database/connetion.js";

const User = sequelize.define(
    "User",
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
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.ENUM("admin", "organizer", "participant"),
            defaultValue: "participant",
        },
    },
    {
        timestamps: true,
        tableName: "Users",
    },
);

export default User;
