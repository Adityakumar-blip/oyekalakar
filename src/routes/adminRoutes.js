const express = require("express");
const adminAuthController = require("../controllers/adminAuthController");
const adminController = require("../controllers/adminController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");
const adminRoutes = express.Router();

adminRoutes.post("/signup", adminAuthController.signup);
adminRoutes.post("/login", adminAuthController.login);
adminRoutes.post("/forgotPassword", adminAuthController.forgotPassword);
adminRoutes.patch("/resetPassword", adminAuthController.resetPassword);
adminRoutes.get(
  "/getAllSellers",
  authenticateToken,
  requireAdmin,
  adminController.getAllSellers
);
adminRoutes.get("/getAllArtists", requireAdmin, adminController.getAllArtists);
adminRoutes.get(
  "/getAllUsers",
  authenticateToken,
  requireAdmin,
  adminController.getAllUsers
);
adminRoutes.patch(
  "/updateSeller",
  authenticateToken,
  requireAdmin,
  adminController.updateSeller
);
adminRoutes.patch(
  "/updateArtist",
  authenticateToken,
  requireAdmin,
  adminController.updateArtist
);

module.exports = adminRoutes;
