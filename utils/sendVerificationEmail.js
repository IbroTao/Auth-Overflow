const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ name, email, verificationToken }) => {
  const message = `<p>Please confirm your email by clicking on the following link: <a href="http://localhost:2024/api/user/verify-email?token=${verificationToken}&email=${email}"></p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};

module.exports = { sendVerificationEmail };
