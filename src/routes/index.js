const express = require("express");
const router = express.Router();

// Sample route
router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Node.js App!" });
});

module.exports = router;
