const db = require('../models/index');
const { User } = db;
const cron = require('node-cron');
const sendReport = require('../config/redisConfig');

const scheduleCron = async() => {
  cron.schedule('09 17 * * 2' , async() => {
    const users = await User.findAll({ raw:true });
  
    users.forEach(async(user) => {
      await sendReport.add('reportqueue' , { user });
    });
  });
}

module.exports = scheduleCron;