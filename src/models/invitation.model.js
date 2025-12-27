import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Invitation = sequelize.define(
  "Invitation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    receiverEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Events",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
    tableName: "Invitations",
  },
);

export default Invitation;
