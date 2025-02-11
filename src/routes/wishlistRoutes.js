const express = require("express");
const wishlistController = require("../controllers/wishlistController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const wishlistRoutes = express.Router();

wishlistRoutes.post(
  "/add",
  authenticateToken,
  wishlistController.addToWishlist
);
wishlistRoutes.get(
  "/get",
  authenticateToken,
  wishlistController.getWishlistByUser
);
wishlistRoutes.delete(
  "/remove",
  authenticateToken,
  wishlistController.removeFromWishlist
);

module.exports = wishlistRoutes;
