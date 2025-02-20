const {
  CustomizationType,
  CustomizationOptions,
} = require("../config/ProductEnum");
const ProductType = require("../config/productTypeEnum");
const Product = require("../models/productSchema");
const { sendSuccess, sendError } = require("../utils/responseService");

// Create a new product
// exports.createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       stock,
//       category,
//       tags,
//       isPersonalizable,
//       personalizationOptions,
//       productSeller,
//     } = req.body;

//     const images = req.files
//       ? req.files.map((file) => ({
//           url: file.path,
//           public_id: "",
//         }))
//       : [];

//     const product = new Product({
//       name,
//       description,
//       price,
//       stock,
//       category,
//       images,
//       tags,
//       isPersonalizable,
//       personalizationOptions,
//       productSeller,
//       roles: req.user.roles,
//     });

//     await product.save();
//     return sendSuccess(res, "Product created successfully", product, 201);
//   } catch (error) {
//     return sendError(res, "Failed to create product", error);
//   }
// };

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      basePrice,
      stock,
      category,
      tags,
      productType,
      productSeller,
      customizationOptions, // Customization input
    } = req.body;

    // Validate product type
    if (!Object.values(ProductType).includes(productType)) {
      return sendError(res, "Invalid product type", 400);
    }

    // Handle image uploads
    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,
          public_id: "",
        }))
      : [];

    let finalCustomizations = [];

    if (
      productType === ProductType.OrderNow ||
      productType === ProductType.BookNow
    ) {
      if (!customizationOptions || !Array.isArray(customizationOptions)) {
        return sendError(
          res,
          "Customization options are required for 'Order Now' and 'Book Now'",
          400
        );
      }

      // Validate customization options
      for (const customization of customizationOptions) {
        if (!CustomizationType[customization.type.toUpperCase()]) {
          return sendError(
            res,
            `Invalid customization type: ${customization.type}`,
            400
          );
        }

        let validOptions = [];

        for (const option of customization.options) {
          if (
            !CustomizationOptions[customization.type.toUpperCase()].includes(
              option.name
            )
          ) {
            return sendError(
              res,
              `Invalid option '${option.name}' for customization type '${customization.type}'`,
              400
            );
          }

          validOptions.push({ name: option.name, price: option.price });
        }

        finalCustomizations.push({
          type: customization.type,
          options: validOptions,
        });
      }
    }

    // If product is "Buy Now", remove customizations
    if (productType === ProductType.BuyNow) {
      finalCustomizations = undefined;
    }

    const product = new Product({
      name,
      description,
      basePrice,
      stock,
      category,
      images,
      tags,
      productType,
      productSeller,
      roles: req.user.roles,
      customizationOptions: finalCustomizations,
    });

    await product.save();
    return sendSuccess(res, "Product created successfully", product, 201);
  } catch (error) {
    return sendError(res, "Failed to create product", error);
  }
};

exports.getProducts = async (req, res) => {
  try {
    let { page, limit, sortBy, order, category, minPrice, maxPrice, search } =
      req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    order = order === "desc" ? -1 : 1;

    const filters = {};
    if (category) filters.category = category;
    if (minPrice)
      filters.price = { ...filters.price, $gte: parseFloat(minPrice) };
    if (maxPrice)
      filters.price = { ...filters.price, $lte: parseFloat(maxPrice) };
    if (search) filters.name = { $regex: search, $options: "i" };

    const total = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .sort({ [sortBy || "createdAt"]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    return sendSuccess(res, "Products retrieved successfully", {
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    return sendError(res, "Failed to fetch products", error);
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email"
    );

    if (!product) return sendError(res, "Product not found", null, 404);

    return sendSuccess(res, "Product retrieved successfully", product);
  } catch (error) {
    return sendError(res, "Failed to fetch product", error);
  }
};

// Update product details
exports.updateProduct = async (req, res) => {
  try {
    const { status, ...otherFields } = req.body;

    console.log("product", req);

    if (status !== undefined) {
      if (req.user.roles !== "Admin") {
        return sendError(
          res,
          "Only admin can update product status",
          null,
          403
        );
      }
    }

    if (req.user.roles === "Seller" || req.user.roles === "Artist") {
      const existingProduct = await Product.findById(req.query.id);
      if (!existingProduct) {
        return sendError(res, "Product not found", null, 404);
      }

      if (existingProduct.userId.toString() !== req.user.id) {
        return sendError(
          res,
          "You can only update your own products",
          null,
          403
        );
      }
    }

    const updateData = req.user.roles === "Admin" ? req.body : otherFields;

    const product = await Product.findByIdAndUpdate(req.query.id, updateData, {
      new: true,
    });

    if (!product) return sendError(res, "Product not found", null, 404);

    return sendSuccess(res, "Product updated successfully", product);
  } catch (error) {
    return sendError(res, "Failed to update product", error);
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return sendError(res, "Product not found", null, 404);

    return sendSuccess(res, "Product deleted successfully");
  } catch (error) {
    return sendError(res, "Failed to delete product", error);
  }
};

// Add a review to a product
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return sendError(res, "Product not found", null, 404);

    product.reviews.push({ user: req.user._id, rating, comment });
    product.ratings =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length;

    await product.save();
    return sendSuccess(res, "Review added successfully", product);
  } catch (error) {
    return sendError(res, "Failed to add review", error);
  }
};

// Get top-rated products
exports.getTopRatedProducts = async (req, res) => {
  try {
    const topProducts = await Product.find().sort({ ratings: -1 }).limit(5);
    return sendSuccess(res, "Top-rated products retrieved", topProducts);
  } catch (error) {
    return sendError(res, "Failed to fetch top-rated products", error);
  }
};

// Get product analytics
exports.getProductAnalytics = async (req, res) => {
  try {
    const analytics = await Product.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$ratings" },
          totalProducts: { $sum: 1 },
        },
      },
    ]);

    return sendSuccess(
      res,
      "Product analytics retrieved successfully",
      analytics[0]
    );
  } catch (error) {
    return sendError(res, "Failed to fetch product analytics", error);
  }
};
