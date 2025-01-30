const nodemailer = require("nodemailer");

const sendEmailOTP = async ({ to, subject, otp }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aditya@sevensquaretech.com",
        pass: "qshszwfyzcomzjqq",
      },
    });

    // Email content
    const mailOptions = {
      from: '"nodemailer" aditya@sevensquaretech.com',
      to,
      subject,
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>.</p><p>It is valid for 10 minutes.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);

    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send OTP.", error };
  }
};

const sendEmail = async ({ userEmail, subject, content }) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SENDGRID_HOST,
      port: process.env.SENDGRID_PORT,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDGRID_SECRET_KEY,
      },
    });

    let payload = {
      from: process.env.SENDER_EMAIL,
      to: userEmail,
      subject: subject,
      html: content,
    };

    // if (rest.length > 0) {
    //   payload["attachments"] = rest[0];
    // }

    const response = await transporter.sendMail(payload);

    if (response) {
      return true;
    }
    return false;
  } catch (err) {
    console.log("Getting error while send email:", err);
    // logger.error(`Getting error while send email : ${err}`);

    return false;
  }
};

module.exports = { sendEmailOTP, sendEmail };
