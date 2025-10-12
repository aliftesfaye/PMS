"use strict";

module.exports = (sequelize, DataTypes) => {
  const Notebook = sequelize.define(
    "Notebook",
    {
      notebook_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      project_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "projects",
          key: "project_id",
        },
      },
      activity_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "activities",
          key: "activity_id",
        },
      },
      sub_task_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "sub_tasks",
          key: "sub_task_id",
        },
      },
      task_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "tasks",
          key: "task_id",
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
      },
      updated_by: {
        type: DataTypes.UUID,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deleted_by: {
        type: DataTypes.UUID,
      },
    },
    {
      tableName: "Notebook",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Notebook;
};
