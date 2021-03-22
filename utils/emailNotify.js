const nodemailer = require('nodemailer');

const sendEmail = async (from, to, fromName, toName) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: `You were invited to a new volunteer project on Volungo!`,
    text: `Hi ${toName}, you were invited to the cool project by ${fromName} on Volungo! Hurry up to join! :)`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;