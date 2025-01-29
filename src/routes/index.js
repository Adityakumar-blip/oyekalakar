const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the OyeKalakar." });
});

router.use("/user", require("./userRoutes.js"));
router.use("/seller", require("./sellerRoutes.js"));
router.use("/artist", require("./artistRoutes.js"));
router.use("/admin", require("./adminRoutes.js"));
router.use("/category", require("./productTypeRoutes.js"));
router.use("/product", require("./productRoutes.js"));
router.use("/cart", require("./cartRoutes.js"));
router.use("/order", require("./orderRoutes.js"));

module.exports = router;
