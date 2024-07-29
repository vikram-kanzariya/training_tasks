const { Worker } = require("bullmq");
const sendReport = require("./config/redisConfig");

const { createObjectCsvWriter } = require("csv-writer");
const path = require("path");
const db = require("./models/index");
const { uploadcsvToCloudinary } = require("./services/cloudinaryUploader");
const { use } = require("./routes/route");
const sendReportMailToUser = require("./services/reportMail");
const { Op } = require("sequelize");
const { User, Medicines, reports, medicine_log } = db;

const worker = new Worker(
  "reportqueue",
  async (job) => {
    const user = job.data.user;
    const userId = user.id;

    let oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let logData = await medicine_log.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Op.gte]: oneWeekAgo,
        },
      },
      attributes: [
        "is_taken",
        "time",
        "medicineId",
        [db.Sequelize.col("Medicine.medicineName"), "medicineName"],
        [db.Sequelize.col("Medicine.description"), "description"],
        [db.Sequelize.col("Medicine.medicineType"), "medicineType"],
      ],
      include: {
        model: Medicines,
        attributes: [],
      },
      raw: true,
    });

    const csvPath = `${path.join(__dirname)}/workerCsvFiles/${
      user.firstName
    }_${Date.now()}-report.csv`;

    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: "medicineId", title: "MEDICINEID" },
        { id: "medicineName", title: "MEDICINENAME" },
        { id: "description", title: "DESCRIPTION" },
        { id: "medicineType", title: "MEDICINE_TYPE" },
        { id: "is_taken", title: "ISTAKEN" },
        { id: "time", title: "time" },
      ],
    });

    const medicineData = logData.map((element) => ({
      medicineId: element.medicineId,
      medicineName: element.medicineName,
      description: element.description,
      medicineType: element.medicineType,
      is_taken: element.is_taken == 1 ? "Yes" : "No",
      time: element.time,
    }));

    await csvWriter.writeRecords(medicineData);
    console.log("csv Generated SuccessFully");

    const filePath = await uploadcsvToCloudinary(csvPath, "workerCsvFiles");

    await sendReportMailToUser(user.email, user.firstName, filePath.secure_url);

    await reports.create({
      userId: user.id,
      fileName: `${filePath.original_filename}`,
      reportGenerateDate: new Date().toISOString().split("T")[0],
      path: filePath.secure_url,
    });
  },
  {
    connection: sendReport.client,
  }
);

module.exports = worker;
