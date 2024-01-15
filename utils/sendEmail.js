const nodemailer = require("nodemailer");
require("dotenv").config();

const sender = process.env.SENDER;
const emailPass = process.env.PASS;

const sendEmail = async ({ to, subject, html }) => {
  const transporter = await nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: sender,
      pass: emailPass,
    },
    secure: true,
  });

  return await transporter.sendMail({
    from: sender,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
