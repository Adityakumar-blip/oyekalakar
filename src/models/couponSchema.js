const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
