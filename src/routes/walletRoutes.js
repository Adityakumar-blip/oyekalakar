const express = require("express");
const wallerController = require("../controllers/wallerController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const walletRoutes = express.Router();

walletRoutes.post("/create", wallerController.createWallet);
walletRoutes.post("/update", wallerController.updateWallet);
walletRoutes.get("/get", wallerController.getWallet);

module.exports = walletRoutes;
