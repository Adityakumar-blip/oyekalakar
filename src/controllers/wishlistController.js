const Wishlist = require("../models/wishlistSchema");
const { sendSuccess, sendError } = require("../utils/responseService");

/**
 * Add a product to the wishlist
 */
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const existingWishlist = await Wishlist.findOne({ userId, productId });
    if (existingWishlist) {
      return sendError(res, "Product already in wishlist", null, 400);
    }

    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();

    return sendSuccess(res, "Product added to wishlist", wishlistItem, 201);
  } catch (error) {
    return sendError(res, "Failed to add product to wishlist", error, 500);
  }
};

/**
 * Get user's wishlist
 */
const getWishlistByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.find({ userId }).populate("productId");

    return sendSuccess(res, "Wishlist retrieved successfully", wishlist);
  } catch (error) {
    return sendError(res, "Failed to fetch wishlist", error, 500);
  }
};

/**
 * Remove a product from the wishlist
 */
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const deletedItem = await Wishlist.findOneAndDelete({ userId, productId });

    if (!deletedItem) {
      return sendError(res, "Product not found in wishlist", null, 404);
    }

    return sendSuccess(res, "Product removed from wishlist");
  } catch (error) {
    return sendError(res, "Failed to remove product from wishlist", error, 500);
  }
};

module.exports = {
  addToWishlist,
  getWishlistByUser,
  removeFromWishlist,
};
