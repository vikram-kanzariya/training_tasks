const { authUser } = require("../middlewares/authUser");
const db = require('../models/index');

const { Medicines , medicine_log } = db;


exports.newMedicineForm = async(req , res) => {
  return res.render('addMedicine');
};

exports.addMedicines = async(req , res) => {
  let medicineName = req.body.medicine;
  let description = req.body.description;
  let medicineType = req.body.medicine_type
  let date = req.body.date;
  let time = req.body.time;
  let reccuring_type = req.body.reccuring_type;
  let day = req.body.day;

  let daily_time = req.body.daily_time;
  let daily_start_date = req.body.daily_start_date;
  let daily_end_date = req.body.daily_end_date;

  let weekly_time = req.body.weekly_time;
  let weekly_start_date = req.body.weekly_start_date;
  let weekly_end_date = req.body.weekly_end_date;

  if(!medicineName || !description || !medicineType || (medicineType === 'one_time' && (!date || !time)) || (medicineType === 'reccuring' && !reccuring_type) || (medicineType === 'reccuring' && reccuring_type == 'daily' && (!daily_time || !daily_start_date || !daily_end_date)) || (medicineType == "reccuring" && reccuring_type == 'weekly' && (!weekly_time || !weekly_start_date || !weekly_end_date)) ){

      console.log("Please Enter All fields Properly...")
   
  }
  else{

    let newMedicine = await Medicines.create({
      userId:req.user.userId,
      email:req.user.email,
      medicineName:medicineName,
      description:description,
      medicineType:medicineType,
      reccuringType:reccuring_type,
      date:date == "" ? null:date,
      time:time,
      dailyTime:daily_time,
      dailyStartDate:daily_start_date == "" ? null : daily_start_date,
      dailyEndDate:daily_end_date == ""? null : daily_end_date,
      day:day,
      weeklyTime:weekly_time,
      weeklyStartDate:weekly_start_date == ""? null : weekly_start_date,
      weeklyEndDate:weekly_end_date ==  ""? null : weekly_end_date,
    });
    console.log("Medicine Added Successfully");
  
    return res.status(200).redirect('/details');

  }
} 

exports.findMedicines = async(req , res) => {
  const data = await Medicines.findAll({
    include:'User'
  })
  return res.json({ data:data });
}

exports.markAsDone = async(req , res) => {
 let medicineLogId = req.query.medicineLogId;

 let findMedicineLog = await medicine_log.findByPk(medicineLogId);

  if(!findMedicineLog){
    return res.json({
      success:false,
      message:"Something Went Wrong, please try Again"
    })
  }

  let dt = new Date().toString();
  dt = dt.split(' ');

    let markDone = await medicine_log.update({
      is_taken:true,
      time:dt[4],
    },
    {
      where:{ id: medicineLogId }
    }
    );
  
    return res.render('updateStatus');
}