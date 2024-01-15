const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ name, email, token }) => {
  const verifyEmail = `http://localhost:2024/api/user/verify-email?token=${token}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}"></p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};

module.exports = sendVerificationEmail;
