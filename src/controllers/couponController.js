const Coupon = require("../models/couponSchema");
const { sendSuccess, sendError } = require("../utils/responseService");

/**
 * Create a new coupon
 */
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      expirationDate,
      usageLimit,
      minOrderAmount,
      maxDiscount,
    } = req.body;

    // Validate discount type
    if (!["flat", "percentage"].includes(discountType)) {
      return sendError(
        res,
        "Invalid discount type. Choose 'flat' or 'percentage'",
        null,
        400
      );
    }

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return sendError(res, "Coupon code already exists", null, 400);
    }

    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      expirationDate,
      usageLimit,
      minOrderAmount,
      maxDiscount,
    });
    await coupon.save();

    return sendSuccess(res, "Coupon created successfully", coupon, 201);
  } catch (error) {
    return sendError(res, "Failed to create coupon", error, 500);
  }
};

/**
 * Apply a coupon code
 */
const applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return sendError(res, "Invalid or expired coupon", null, 400);
    }

    if (new Date(coupon.expirationDate) < new Date()) {
      return sendError(res, "Coupon has expired", null, 400);
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return sendError(res, "Coupon usage limit reached", null, 400);
    }

    if (orderAmount < coupon.minOrderAmount) {
      return sendError(
        res,
        `Minimum order amount should be ${coupon.minOrderAmount}`,
        null,
        400
      );
    }

    let discount = 0;

    if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    } else if (coupon.discountType === "percentage") {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    }

    // Increment usage count
    coupon.usedCount += 1;
    await coupon.save();

    return sendSuccess(res, "Coupon applied successfully", { discount });
  } catch (error) {
    return sendError(res, "Failed to apply coupon", error, 500);
  }
};

/**
 * Get all coupons
 */
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    return sendSuccess(res, "Coupons retrieved successfully", coupons);
  } catch (error) {
    return sendError(res, "Failed to fetch coupons", error, 500);
  }
};

/**
 * Get a single coupon by ID
 */
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return sendError(res, "Coupon not found", null, 404);
    }

    return sendSuccess(res, "Coupon retrieved successfully", coupon);
  } catch (error) {
    return sendError(res, "Failed to fetch coupon", error, 500);
  }
};

/**
 * Update a coupon
 */
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expirationDate, isActive, usageLimit } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discount, expirationDate, isActive, usageLimit },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return sendError(res, "Coupon not found", null, 404);
    }

    return sendSuccess(res, "Coupon updated successfully", updatedCoupon);
  } catch (error) {
    return sendError(res, "Failed to update coupon", error, 500);
  }
};

/**
 * Delete a coupon
 */
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return sendError(res, "Coupon not found", null, 404);
    }

    return sendSuccess(res, "Coupon deleted successfully");
  } catch (error) {
    return sendError(res, "Failed to delete coupon", error, 500);
  }
};

module.exports = {
  createCoupon,
  applyCoupon,
  getAllCoupons,
  deleteCoupon,
  updateCoupon,
  getCouponById,
};
