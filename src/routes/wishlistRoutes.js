const express = require("express");
const wishlistController = require("../controllers/wishlistController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const wishlistRoutes = express.Router();

wishlistRoutes.post("/add", wishlistController.addToWishlist);
wishlistRoutes.get("/get", wishlistController.getWishlistByUser);
wishlistRoutes.delete("/remove", wishlistController.removeFromWishlist);

module.exports = wishlistRoutes;
