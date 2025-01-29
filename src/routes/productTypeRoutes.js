const express = require("express");
const productType = require("../controllers/productTypeController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");
const productTypeRoutes = express.Router();

productTypeRoutes.post(
  "/create",
  authenticateToken,
  requireAdmin,
  productType.createProductType
);
productTypeRoutes.get(
  "/get",
  authenticateToken,
  requireAdmin,
  productType.getAllProductType
);
productTypeRoutes.get(
  "/getById",
  authenticateToken,
  requireAdmin,
  productType.getProductTypeById
);
productTypeRoutes.patch(
  "/updateProductType",
  authenticateToken,
  requireAdmin,
  productType.updateProductType
);
productTypeRoutes.delete(
  "/delete",
  authenticateToken,
  requireAdmin,
  productType.deleteProductType
);

module.exports = productTypeRoutes;
