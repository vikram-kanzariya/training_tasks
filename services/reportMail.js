const nodeMailer = require("nodemailer");
require("dotenv").config();

const sendReportMailToUser = async (emailObj, name, filepath) => {
  const mailTransporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: emailObj,
    subject: "Weekly Medicine Report",
    html: `<p>Dear ${name},</p> </br></br>  <p>This auto generated report. This mail is a weekly Report E-Mail. Please click button and download your weekly report.</p> <a href=${filepath} style="background-color: light-blue; font-size:18px; color: blue; padding: 10px; text-decoration: none; font-weight:bold">Download Report</a>`,
  };

  mailTransporter.sendMail(mailOptions, async (err, info) => {
    if (err) throw err;
    console.log("Mail has been Sent Successfully: ", info.response);
  });
};

module.exports = sendReportMailToUser;
