const CartItem = require("../models/cartItemSchema");
const Product = require("../models/productSchema");
const { sendSuccess, sendError } = require("../utils/responseService");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!productId || !quantity || quantity <= 0) {
      return sendError(res, "Invalid product ID or quantity", null, 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return sendError(res, "Product not found", null, 404);
    }

    let cartItem = await CartItem.findOne({ user: userId, product: productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.totalPrice = product.price * cartItem.quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        user: userId,
        product: productId,
        quantity,
        price: product.price,
        totalPrice: product.price * quantity,
      });
    }

    sendSuccess(res, "Item added to cart successfully", cartItem, 201);
  } catch (error) {
    sendError(res, "Failed to add item to cart", error, 500);
  }
};

exports.getCart = async (req, res) => {
  try {
    // Fetch cart items with product details
    const cartItems = await CartItem.find({ user: req.user.id })
      .populate("product")
      .lean();

    if (!cartItems) {
      return sendError(res, "Cart not found", null, 404);
    }

    // Calculate totals
    const calculatedCart = {
      items: cartItems.map((item) => {
        // Ensure product exists and has valid price
        if (!item.product || typeof item.product.price !== "number") {
          throw new Error(`Invalid product data for cart item: ${item._id}`);
        }

        const itemTotal = item.product.price * (item.quantity || 1);

        return {
          ...item,
          itemTotal: Number(itemTotal.toFixed(2)),
        };
      }),
      totalAmount: 0,
      totalItems: 0,
    };

    // Calculate cart totals
    calculatedCart.totalAmount = Number(
      calculatedCart.items
        .reduce((sum, item) => sum + item.itemTotal, 0)
        .toFixed(2)
    );
    calculatedCart.totalItems = calculatedCart.items.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

    sendSuccess(res, "Cart items retrieved successfully", {
      cartItems: calculatedCart.items,
      summary: {
        totalAmount: calculatedCart.totalAmount,
        totalItems: calculatedCart.totalItems,
      },
    });
  } catch (error) {
    console.error("Cart retrieval error:", error);
    sendError(
      res,
      error.message || "Failed to retrieve cart items",
      error,
      error.status || 500
    );
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity, id } = req.body;
    const cartItem = await CartItem.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return sendError(res, "Cart item not found", null, 404);
    }

    sendSuccess(res, "Cart item updated successfully", cartItem);
  } catch (error) {
    sendError(res, "Failed to update cart item", error, 500);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(req.params.id);

    if (!cartItem) {
      return sendError(res, "Cart item not found", null, 404);
    }

    sendSuccess(res, "Cart item removed successfully");
  } catch (error) {
    sendError(res, "Failed to remove cart item", error, 500);
  }
};
