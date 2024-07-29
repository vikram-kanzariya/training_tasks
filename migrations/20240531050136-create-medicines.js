'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Medicines', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Users',
          key:'id'
        }
      },
      
      email:{ type:DataTypes.STRING },

      medicineName: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },

      medicineType:{ type:Sequelize.STRING },
      reccuringType: { type:Sequelize.STRING } ,

      date:{ type:Sequelize.DATEONLY },
      time:{ type:Sequelize.TIME ,  },

      dailyTime: { type:Sequelize.TIME },
      dailyStartDate:{ type:Sequelize.DATEONLY },
      dailyEndDate:{ type: Sequelize.DATEONLY },

      day:{ type:Sequelize.STRING },
      weeklyTime: { type:Sequelize.TIME },
      weeklyStartDate: { type:Sequelize.DATEONLY },
      weeklyEndDate: { type:Sequelize.DATEONLY },

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
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Medicines');
  }
};