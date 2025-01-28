const express = require("express");
const sellerController = require("../controllers/sellerController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const sellerRoutes = express.Router();

sellerRoutes.post("/create", sellerController.registerSeller);
sellerRoutes.get("/get", authenticateToken, sellerController.getSellerProfile);
sellerRoutes.post("/login", sellerController.loginSeller);
// sellerRoutes.get("/getUserById", sellerController.getUserById);
// sellerRoutes.put("/update", sellerController.updateUser);
// sellerRoutes.delete("/delete", sellerController.deletedUser);

module.exports = sellerRoutes;
