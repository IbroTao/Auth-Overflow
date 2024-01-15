const sendEmail = require("./sendEmail");

const sendPasswordResetEmail = async ({ email, token, name }) => {
  const resetURL = `http://localhost:2024/api/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset your password by clicking on the following link: <a href="${resetURL}"></p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password Link",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};

module.exports = sendPasswordResetEmail;
