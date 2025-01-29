const User = require("../models/userSchema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { sendSuccess, sendError } = require("../utils/responseService.js");
const { createUserSchema } = require("../utils/schema/createUserSchema.js");

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

    const { name, email, phoneNumber, password, address, pin } = req.body;

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
      address,
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
