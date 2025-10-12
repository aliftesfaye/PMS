"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {}
  Notification.init(
    {
      notification_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        required: true,
      },
      message: {
        type: DataTypes.STRING,
        required: true,
      },
      user_id: {
        type: DataTypes.UUID,
        required: true,
        references: {
          model: "users", // The name of the referenced model
          key: "user_id", // The name of the referenced column in the User table
        },
      },
      project_id: {
        type: DataTypes.UUID,
        references: {
          model: "projects", // The name of the referenced model
          key: "project_id", // The name of the referenced column in the project table
        },
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,

        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "notifications",
      modelName: "Notification",
    }
  );
  return Notification;
};
