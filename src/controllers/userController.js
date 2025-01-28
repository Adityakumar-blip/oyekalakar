const User = require("../models/userSchema.js");
const { sendSuccess, sendError } = require("../utils/responseService.js");
const { createUserSchema } = require("../utils/schema/createUserSchema.js");

// Create a new user
exports.createUser = async (req, res) => {
  try {
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

    const newUser = new User({
      name,
      email,
      phoneNumber,
      password,
      address,
      pin,
    });

    const savedUser = await newUser.save();
    sendSuccess(res, "User created successfully", savedUser, 201);
  } catch (err) {
    sendError(res, "Failed to create user", err, 400);
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
