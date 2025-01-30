const mongoose = require("mongoose");
const ROLES = require("../config/roleEnum");

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    refPath: "roles",
  },
  roles: {
    type: String,
    enum: Object.values(ROLES),
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Wallet", walletSchema);
