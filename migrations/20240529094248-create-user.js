'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      password: {
        type: Sequelize.STRING
      },
      pw_salt: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      activation_token: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue:0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt:{
        type:Sequelize.TIME
      }

    }, 
  );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};