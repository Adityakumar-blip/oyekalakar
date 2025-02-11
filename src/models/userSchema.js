const mongoose = require("mongoose");
const ROLES = require("../config/roleEnum.js");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  roles: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER,
  },
  pin: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
