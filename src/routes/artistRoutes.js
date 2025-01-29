const express = require("express");
const artistController = require("../controllers/artistController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const artistRoutes = express.Router();

artistRoutes.post("/create", artistController.registerArtist);
artistRoutes.post("/login", artistController.loginArtist);
artistRoutes.get(
  "/getArtitst",
  authenticateToken,
  artistController.getArtistById
);
artistRoutes.patch(
  "/update",
  authenticateToken,
  artistController.updateArtistProfile
);

module.exports = artistRoutes;
