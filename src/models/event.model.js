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
    startTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.TIME,
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
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("upcoming", "ongoing", "completed", "cancelled"),
      defaultValue: "upcoming",
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ticketPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
    tableName: "Events",
    underscored: true, // snake_case for columns
  },
);

export default Event;
