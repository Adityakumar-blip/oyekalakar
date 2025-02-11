const express = require("express");
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const userRoutes = express.Router();

userRoutes.post("/create", userController.createUser);
userRoutes.post("/sendOtp", userController.sendOtp);
userRoutes.post("/verifyOtpLogin", userController.verifyOtpAndLogin);
userRoutes.post("/login", userController.loginUser);
userRoutes.get("/get", authenticateToken, userController.getAllUsers);
userRoutes.get("/getUserById", authenticateToken, userController.getUserById);
userRoutes.patch(
  "/update",
  authenticateToken,
  userController.updateUserDetails
);
userRoutes.delete("/delete", authenticateToken, userController.deletedUser);

module.exports = userRoutes;
