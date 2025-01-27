const mongoose = require("mongoose");
const STATUS = require("../config/statusEnum.js");

const artistRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  formDetails: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(STATUS),
    default: [STATUS.PENDING],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("ArtistRequest", artistRequestSchema);
