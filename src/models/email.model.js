import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const EmailTemplate = sequelize.define(
  "EmailTemplate",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    templateKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    htmlContent: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "EmailTemplates",
  },
);

export default EmailTemplate;
