const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema(
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
    topics: [{ type: String }],
    date: { type: Date, required: true },
    duration: { type: String },
    mode: { type: String, enum: ["Online", "Offline"], required: true },
    location: { type: String },
    price: { type: Number, default: 0 }, // 0 for free workshops, otherwise paid
    currency: { type: String, default: "INR" },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workshop", workshopSchema);
