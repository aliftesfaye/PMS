"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("notifications", {
      notification_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        required: true,
        defaultValue: Sequelize.UUIDV4,
      },
      message: {
        type: Sequelize.STRING,
        required: true,
      },
      user_id: {
        type: Sequelize.UUID,

        required: true,
        references: {
          model: "users", // The name of the referenced model
          key: "user_id", // The name of the referenced column in the User table
        },
      },
      project_id: {
        type: Sequelize.UUID,
        references: {
          model: "projects", // The name of the referenced model
          key: "project_id", // The name of the referenced column in the project table
        },
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("notifications");
  },
};
