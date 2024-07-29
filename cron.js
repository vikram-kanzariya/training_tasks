const db = require('./models/index');
const { User , Medicines , medicine_log } = db;
const nodeMailer = require('nodemailer');
const cron = require('node-cron');
const config = require('./config/config.json');
const { raw } = require('mysql2');
const generateCSVFiles = require('./services/generateCsv');
const path = require('path')


const runCron = async() => {
  try {
    const datas = await Medicines.findAll(); 
  
    datas.forEach((data) => {
      
      if(data.medicineType === 'one_time'){
        const cronTime = `${data.time.split(':')[1]} ${data.time.split(':')[0]} ${new Date(data.date).getDate()} ${new Date(data.date).getMonth() + 1} *`;

        cron.schedule(cronTime, async() => {
          console.log('Mail Send Success: ');

          const medicineLog = await medicine_log.create({
            userId:data.userId,
            medicineId:data.id
          });

          sendMailToUser(data.email , medicineLog.id , data.medicineName , data.description , `${data.time.split(':')[0]}:${data.time.split(':')[1]}` );

        });
      }
      else if(data.medicineType === 'reccuring'){
        if(data.reccuringType === 'daily'){
       
          const cronTime = `${data.dailyTime.split(':')[1]} ${data.dailyTime.split(':')[0]} * * *`;
          let currDate = new Date();
          cron.schedule(cronTime , async() => {
            if(currDate >= new Date(data.dailyStartDate) && currDate <= new Date(data.dailyEndDate)){

              const medicineLog = await medicine_log.create({
                userId:data.userId,
                medicineId:data.id
              });
              sendMailToUser(data.email , medicineLog.id , data.medicineName , data.description , `${data.dailyTime.split(':')[0]}:${data.dailyTime.split(':')[1]}`)
            }
          });

        }
        else if(data.reccuringType === 'weekly'){
      
          const cronTime = `${data.weeklyTime.split(':')[1]} ${data.weeklyTime.split(':')[0]} * * ${data.day}`

          let currDate = new Date();
          
          cron.schedule(cronTime , async() => {
            if(currDate >= new Date(data.weeklyStartDate) && currDate <= new Date(data.weeklyEndDate) && data.day == new Date().getDay()){
              console.log('Cron is Runnig Vey Well')

              const medicineLog = await medicine_log.create({
                userId:data.userId,
                medicineId:data.id
              });
    
              sendMailToUser(data.email , medicineLog.id , data.medicineName , data.description , `${data.weeklyTime.split(':')[0]}:${data.weeklyTime.split(':')[1]}`);
            }
          });
        }
      }
 
    });
   
  } catch (error) {
    console.error("Error: " + error);
    throw error;    
  }
};

const cronJobs= ()=>{
  cron.schedule('* * * * *' , async () => {
    await runCron();
    console.log("CRON running");
  })
}


const sendMailToUser = async(emailObj , medicineLogId , medicineName , desc , time) => {
  const mailTransporter = nodeMailer.createTransport({
    host:process.env.MAIL_HOST,
    port:process.env.MAIL_PORT,
    secure:false,
    requireTLS:true,
    auth:{
      user:process.env.MAIL_USER,
      pass:process.env.MAIL_PASS,
    },
    
  });

  const emailData = await User.findOne({
    include:Medicines
  });


  const mailOptions = { 
    from:process.env.MAIL_USER,
    to:emailObj,
    subject:'Medicine-Reminder',
    html:`<h2>Reminder, Please Take Your Medicine: ${medicineName}</h2> 
    <h3>Description: ${desc}</h3>
     <h3>Time to take Your Medicine is: ${time}</h3> <br>
    <p>Click this link to Mark as Done to Medicine:<a href="http://localhost:8000/mark-done/?medicineLogId=${medicineLogId}">medicineLogId=${medicineLogId}</a> </p>`,

  };

  mailTransporter.sendMail(mailOptions , async(err , info) => {
    if(err) throw err;
    console.log("Mail has been Sent Successfully: " , info.response);
  }
  )
};

module.exports = { cronJobs } ;