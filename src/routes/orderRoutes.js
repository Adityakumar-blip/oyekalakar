const express = require("express");
const orderItem = require("../controllers/orderController.js");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");
const orderRoutes = express.Router();

orderRoutes.post("/create", authenticateToken, orderItem.createOrder);
orderRoutes.get("/get", authenticateToken, orderItem.getUserOrders);
orderRoutes.get(
  "/getOrderDetails",
  authenticateToken,
  orderItem.getOrderDetails
);
orderRoutes.patch(
  "/updateOrder",
  authenticateToken,
  orderItem.updateOrderStatus
);

module.exports = orderRoutes;
