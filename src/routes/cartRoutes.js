const express = require("express");
const cartItem = require("../controllers/cartItemController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");
const cartRoutes = express.Router();

cartRoutes.post("/add", authenticateToken, cartItem.addToCart);
cartRoutes.get("/getItem", authenticateToken, cartItem.getCart);
cartRoutes.patch("/updateCart", authenticateToken, cartItem.updateCartItem);
cartRoutes.delete("/remove", authenticateToken, cartItem.removeFromCart);

module.exports = cartRoutes;
