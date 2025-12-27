import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Registration = sequelize.define(
  "Registration",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Events",
        key: "id",
      },
    },
    ticketId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Tickets",
        key: "id",
      },
    },
    registeredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: "Registrations",
  },
);

export default Registration;
