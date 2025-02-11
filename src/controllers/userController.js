const User = require("../models/userSchema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");

const { sendSuccess, sendError } = require("../utils/responseService.js");
const { createUserSchema } = require("../utils/schema/createUserSchema.js");

function generateOTP(length = 6) {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length);
  return otp.toString();
}

exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return sendError(res, "Phone number is required", null, 400);
    }

    // Generate a 6-digit OTP
    const otp = generateOTP();

    // Store OTP in a JWT (valid for 5 mins)
    const otpToken = jwt.sign({ phoneNumber, otp }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    // Send OTP via SMS
    // const smsSent = await this.sendOtp(phoneNumber, otp);
    // if (!smsSent) {
    //   return sendError(res, "Failed to send OTP", null, 500);
    // }

    sendSuccess(res, "OTP sent successfully", { otpToken, otp }, 200);
  } catch (err) {
    console.error("OTP send error:", err);
    sendError(res, "Failed to send OTP", err, 500);
  }
};

exports.verifyOtpAndLogin = async (req, res) => {
  try {
    const { phoneNumber, otp, otpToken } = req.body;

    if (!phoneNumber || !otp || !otpToken) {
      return sendError(res, "Missing required fields", null, 400);
    }

    // Verify OTP token
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    if (
      !decoded ||
      decoded.phoneNumber !== phoneNumber ||
      decoded.otp !== otp
    ) {
      return sendError(res, "Invalid or expired OTP", null, 400);
    }

    // Check if user already exists
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      // Create new user with just phoneNumber
      user = new User({ phoneNumber, email: "" });
      await user.save();
    }

    // Generate JWT token for user login
    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    sendSuccess(res, "OTP verified & user logged in", { user, token }, 200);
  } catch (err) {
    console.error("OTP verification error:", err);
    sendError(res, "Invalid or expired OTP", err, 400);
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
      return sendError(res, "Provide at least one field to update", null, 400);
    }

    let updates = {};
    if (name) updates.name = name;
    if (email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return sendError(res, "Invalid email format", null, 400);
      }
      updates.email = email;
    }
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    sendSuccess(res, "User details updated", updatedUser, 200);
  } catch (err) {
    console.error("User update error:", err);
    sendError(res, "Failed to update user", err, 500);
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    // Validate request body
    const { error } = createUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return sendError(
        res,
        "Validation failed",
        { errors: errorMessages },
        400
      );
    }

    const { name, email, phoneNumber, password, pin } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, "Email already registered", null, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      pin,
    });

    const savedUser = await newUser.save();

    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    sendSuccess(res, "User created successfully", userResponse, 201);
  } catch (err) {
    console.error("User creation error:", err);
    sendError(res, "Failed to create user", err, 500);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "User not found.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, "Invalid credentials.");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userObject = user.toObject();
    delete userObject.password;

    sendSuccess(res, "Login successful", { data: userObject, token });
  } catch (err) {
    console.error(err);
    sendError(res, "Internal Server Error.", err);
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, "User not found", null, 404);
    sendSuccess(res, "User retrieved successfully", user);
  } catch (error) {
    sendError(res, "Failed to retrieve user", error, 400);
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    sendSuccess(res, "Users retrieved successfully", users);
  } catch (error) {
    sendError(res, "Failed to retrieve users", error, 500);
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return sendError(res, "User not found", null, 404);
    sendSuccess(res, "User updated successfully", updatedUser);
  } catch (error) {
    sendError(res, "Failed to update user", error, 400);
  }
};

// Delete a user by ID
exports.deletedUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return sendError(res, "User not found", null, 404);
    sendSuccess(res, "User deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete user", error, 400);
  }
};
