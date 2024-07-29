'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medicines extends Model {
   
    static associate(models) {
      // define association here

      Medicines.belongsTo(models.User , { foreignKey:'userId' });
      Medicines.hasMany(models.medicine_log , { foreignKey:'medicineId' });
    }
  }
  Medicines.init({
    userId: DataTypes.INTEGER,
    email:DataTypes.STRING,
    medicineName: DataTypes.STRING,
    description: DataTypes.STRING,

    medicineType:DataTypes.STRING,
    reccuringType:DataTypes.STRING,

    date:DataTypes.DATEONLY,
    time:DataTypes.TIME,

    dailyTime:DataTypes.TIME,
    dailyStartDate:DataTypes.DATEONLY,
    dailyEndDate:DataTypes.DATEONLY,

    day:DataTypes.STRING,
    weeklyTime:DataTypes.TIME,
    weeklyStartDate:DataTypes.DATEONLY,
    weeklyEndDate:DataTypes.DATEONLY,
  }, {
    sequelize,
    paranoid:true,
    modelName: 'Medicines',
  });
  return Medicines;
};