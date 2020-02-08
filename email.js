const nodemailer = require("nodemailer");

exports.send = async function(to, text, attachments) {
  let transporter = nodemailer.createTransport({
    host: process.env.TELEGRAM_BOT_SMTP_HOST,
    port: +process.env.TELEGRAM_BOT_SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.TELEGRAM_BOT_SMTP_USERNAME,
      pass: process.env.TELEGRAM_BOT_SMTP_PASSWORD
    }
  });

  let info = await transporter.sendMail({
    from: process.env.TELEGRAM_BOT_SMTP_USERNAME,
    to,
    subject: "Hello ✔",
    text,
    attachments
  });

  console.log("Message sent: %s", info.messageId);
};
