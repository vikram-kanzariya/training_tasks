'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medicine_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references:{ model:'Users' , key:'id' }
      },
      medicineId: {
        type: Sequelize.INTEGER,
        references:{ model:'Medicines' , key:'id' }
      },
      is_taken: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
      },
      time: {
        type: Sequelize.TIME,
        defaultValue:null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('medicine_logs');
  }
};