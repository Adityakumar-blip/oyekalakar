const Product = require("../models/productSchema");
const { sendSuccess, sendError } = require("../utils/responseService");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      seller,
      tags,
      isPersonalizable,
      personalizationOptions,
    } = req.body;

    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,
          public_id: "",
        }))
      : [];

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      seller,
      images,
      tags,
      isPersonalizable,
      personalizationOptions,
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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
