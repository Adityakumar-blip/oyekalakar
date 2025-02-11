const express = require("express");
const couponController = require("../controllers/couponController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");
const couponRoutes = express.Router();

couponRoutes.post("/create", authenticateToken, couponController.createCoupon);
couponRoutes.get("/getAllCoupons", couponController.getAllCoupons);
couponRoutes.get(
  "/getByCreator",
  authenticateToken,
  couponController.getCouponsByCreator
);
couponRoutes.get("/getById", authenticateToken, couponController.getCouponById);
couponRoutes.patch("/update", authenticateToken, couponController.updateCoupon);
couponRoutes.delete(
  "/delete",
  authenticateToken,
  couponController.deleteCoupon
);

module.exports = couponRoutes;
