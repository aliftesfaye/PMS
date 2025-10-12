"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          user_id: "1f86c757-9b1f-4d4c-a73c-5f16be5e228a",
          full_name: "system admin",
          first_time_status: true,
          img_url: "",
          email: "admin@admin.com",
          gender: "Male",
          password: "",
          unchanged_password: "123456",
          division_id: "",
          refreshToken: "",
          team_id: "",
          project_status: false,
          account_status: true,
          created_by: "",
          updated_by: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          is_deleted: false,
          is_division_leader: false,
          deletionAt: null,
          deletedBy: null,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
