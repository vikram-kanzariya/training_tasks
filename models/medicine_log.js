'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medicine_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      medicine_log.belongsTo(models.User , { foreignKey:'userId' });
      medicine_log.belongsTo(models.Medicines , { foreignKey:'medicineId' })
    }
  }
  medicine_log.init({
    userId: DataTypes.INTEGER,
    medicineId: DataTypes.INTEGER,
    is_taken: DataTypes.BOOLEAN,
    time: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'medicine_log',
  });
  return medicine_log;
};