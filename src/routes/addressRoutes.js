const express = require("express");
const addressController = require("../controllers/addressController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const addressRoutes = express.Router();

addressRoutes.post("/add", addressController.addAddress);
addressRoutes.get("/verifyPincode", addressController.verifyPincode);

module.exports = addressRoutes;
