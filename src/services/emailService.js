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

module.exports = sendEmailOTP;
