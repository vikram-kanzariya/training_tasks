'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reports extends Model {
 
    static associate(models) {
      // define association here
      reports.belongsTo( models.User , { foreignKey:'userId' } )
    }
  }
  reports.init({
    userId: DataTypes.INTEGER,
    fileName:DataTypes.STRING,
    reportGenerateDate: DataTypes.DATEONLY,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'reports',
  });
  return reports;
};