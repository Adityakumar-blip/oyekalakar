const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    bannerImage: { type: String },
    createdBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      role: {
        type: String,
        enum: ["Admin", "Seller", "Artist"],
        required: true,
      },
    },
    prize: { type: String, required: true },
    rules: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, default: 0 }, // Entry fee for contest (0 = free)
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Ended"],
      default: "Upcoming",
    },
    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        submission: { type: String },
      },
    ],
    winners: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        position: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contest", contestSchema);
