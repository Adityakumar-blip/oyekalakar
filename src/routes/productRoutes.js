const express = require("express");
const product = require("../controllers/productController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");
const upload = require("../services/multerService");
const productRoutes = express.Router();

productRoutes.post(
  "/create",
  authenticateToken,
  upload.array("images", 5),

  product.createProduct
);
productRoutes.post("/addReview", product.addReview);
productRoutes.get("/get", product.getProducts);
productRoutes.get("/getById", product.getProductById);
productRoutes.get("/getTopProducts", product.getTopRatedProducts);
productRoutes.get("/getProductAnalytics", product.getProductAnalytics);
productRoutes.patch("/updateProduct", authenticateToken, product.updateProduct);
productRoutes.delete("/delete", product.deleteProduct);

module.exports = productRoutes;
