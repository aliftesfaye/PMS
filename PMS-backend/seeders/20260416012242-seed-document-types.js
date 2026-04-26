'use strict';

/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('document_types', [{
      document_type_id: uuidv4(),
      document_type: 'Project Charter',
      created_by: null,
      updated_by: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      is_deleted: false,
      deletionAt: null,
      deletedBy: null
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('document_types', { document_type: 'Project Charter' }, {});
  }
};