const {Queue, Worker} = require("bullmq");

const redisOptions = { host: "127.0.0.1", port: 6379 };

const sendReport = new Queue('reportqueue' , { connection:redisOptions })

module.exports = sendReport;
