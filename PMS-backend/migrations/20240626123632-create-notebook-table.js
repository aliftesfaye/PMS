"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Notebook", {
      notebook_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "projects",
          key: "project_id",
        },
      },
      activity_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "activities",
          key: "activity_id",
        },
      },
      sub_task_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "sub_tasks",
          key: "sub_task_id",
        },
      },
      task_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "tasks",
          key: "task_id",
        },
      },

      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.UUID,
      },
      updated_by: {
        type: Sequelize.UUID,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_by: {
        type: Sequelize.UUID,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Notebook");
  },
};
