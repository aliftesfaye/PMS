"use strict";
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Document_type = sequelize.define(
    "Document_type",
    {
      document_type_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      document_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by: DataTypes.UUID,
      updated_by: DataTypes.UUID,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      is_deleted: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deletionAt: DataTypes.DATE,
      deletedBy: DataTypes.UUID,
    },
    {
      timestamps: true,
      sequelize,
      tableName: "document_types",
      modelName: "Document_type",
    }
  );

  return Document_type;
};
