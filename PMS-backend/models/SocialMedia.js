"use strict";
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SocialMedia = sequelize.define(
    "SocialMedias",
    {
      media_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      name: DataTypes.STRING,
      logo: DataTypes.STRING,
      general_url: DataTypes.STRING,

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
      tableName: "socialmedias",
      modelName: "SocialMedia",
    }
  );

  return SocialMedia;
};
