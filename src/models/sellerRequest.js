const mongoose = require("mongoose");
const STATUS = require("../config/statusEnum.js");
const ROLES = require("../config/roleEnum.js");

const sellerRequestSchema = new mongoose.Schema({
  sellerName: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gstNumber: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
    default: "",
  },
  
  status: {
    type: String,
    enum: Object.values(STATUS),
    default: STATUS.PENDING,
  },
  roles: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.SELLER,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Seller", sellerRequestSchema);
