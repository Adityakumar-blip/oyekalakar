const express = require("express");
const workshop = require("../controllers/workshopController.js");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");
const workshopRoutes = express.Router();

workshopRoutes.post("/create", authenticateToken, workshop.createWorkshop);
workshopRoutes.get(
  "/getAllWorkshops",
  authenticateToken,
  workshop.getWorkshops
);
workshopRoutes.get(
  "/getWorkshopById",
  authenticateToken,
  workshop.getWorkshopById
);
workshopRoutes.patch(
  "/updateWorkshop",
  authenticateToken,
  workshop.updateWorkshop
);
workshopRoutes.delete(
  "/removeWorkshop",
  authenticateToken,
  workshop.deleteWorkshop
);

module.exports = workshopRoutes;
