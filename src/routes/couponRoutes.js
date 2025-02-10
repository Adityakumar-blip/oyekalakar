const express = require("express");
const couponController = require("../controllers/couponController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const couponRoutes = express.Router();

couponRoutes.post("/create", couponController.createCoupon);
couponRoutes.get("/getAllCoupons", couponController.getAllCoupons);
couponRoutes.get("/getById", couponController.getCouponById);
couponRoutes.patch("/update", couponController.updateCoupon);
couponRoutes.delete("/delete", couponController.deleteCoupon);

module.exports = couponRoutes;
