const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminSchema");
const { sendSuccess, sendError } = require("../utils/responseService");
const sendEmailOTP = require("../services/emailService");

exports.signup = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  try {
    const adminExists = await Admin.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (adminExists) {
      return sendError(
        res,
        "Admin with this email or phone number already exists."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await admin.save();
    sendSuccess(res, "Admin created successfully.");
  } catch (err) {
    console.error(err);
    sendError(res, "Internal Server Error.", err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return sendError(res, "Admin not found.");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return sendError(res, "Invalid credentials.");
    }

    const token = jwt.sign(
      { id: admin._id, roles: admin.roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const adminObject = admin.toObject();
    delete adminObject.password;

    sendSuccess(res, "Login successful", { data: adminObject, token });
  } catch (err) {
    console.error(err);
    sendError(res, "Internal Server Error.", err);
  }
};

exports.forgotPassword = async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const admin = await Admin.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (!admin) {
      return sendError(res, "Admin not found.");
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    const token = jwt.sign({ otp }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const emailResponse = await sendEmailOTP({
      to: email,
      subject: "Your OTP for Password Reset",
      otp,
    });

    if (!emailResponse.success) {
      return sendError(res, emailResponse.message);
    }

    // if (email) {
    //   console.log(`Your OTP for email (${email}) is: ${otp}`);
    // } else if (phoneNumber) {
    //   console.log(`Your OTP for phone number (${phoneNumber}) is: ${otp}`);
    // }

    console.log("email response: " + emailResponse);

    sendSuccess(res, "OTP sent successfully.", { token });
  } catch (err) {
    console.error(err);
    sendError(res, "Internal Server Error.", err);
  }
};

exports.resetPassword = async (req, res) => {
  const { email, phoneNumber, otp, token, newPassword } = req.body;

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return sendError(res, "Invalid or expired OTP.");
    }

    if (decoded.otp !== otp) {
      return sendError(res, "Invalid OTP.");
    }

    const admin = await Admin.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (!admin) {
      return sendError(res, "Admin not found.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;

    await admin.save();

    sendSuccess(res, "Password reset successfully.");
  } catch (err) {
    console.error(err);
    sendError(res, "Internal Server Error.", err);
  }
};
