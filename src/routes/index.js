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
router.use("/wallet", require("./walletRoutes.js"));
router.use("/wishlist", require("./wishlistRoutes.js"));
router.use("/address", require("./addressRoutes.js"));
router.use("/coupon", require("./couponRoutes.js"));
router.use("/workshop", require("./workshopRoutes.js"));
router.use("/contest", require("./contestRoutes.js"));

module.exports = router;
