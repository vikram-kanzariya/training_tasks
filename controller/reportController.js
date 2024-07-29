const db = require("../models/index");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const { User, Medicines, reports, medicine_log } = db;
const { Op } = require("sequelize");

const ReprtData = async () => {
  let date = new Date();

  const mddata = await Medicines.findAll({
    attributes: [
      "userId",
      "medicineName",
      "description",
      "medicineType",
      [db.Sequelize.col("medicine_logs.medicineId"), "medicineId"],
      [db.Sequelize.col("medicine_logs.is_taken"), "is_taken"],
      [db.Sequelize.col("medicine_logs.time"), "time"],
      [db.Sequelize.col("medicine_logs.createdAt"), "createdAt"],
    ],

    include: {
      model: medicine_log,
      attributes: [],
    },
  });

  console.log("Data is: ", mddata);
};

const getAllReports = async (req, res) => {
  try {
    const reportsData = await reports.findAll({
      where: {
        userId: req.user.userId,
      },
      raw: true,
    });

    return res.render("reports", { reports: reportsData });
  } catch (error) {
    console.error("Some Error: ", error);
    throw error;
  }
};

module.exports = { ReprtData, getAllReports };
