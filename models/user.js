'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      // define association here
    User.hasMany(models.Medicines , { foreignKey:'userId'});
    User.hasMany(models.reports , { foreignKey:'userId'});
    User.hasMany(models.medicine_log , { foreignKey:'userId' });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    pw_salt: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    activation_token: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'User',
  });
  return User;
};