const Order = require("../models/orderSchema");
const CartItem = require("../models/cartItemSchema");
const { sendSuccess, sendError } = require("../utils/responseService");

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    const cartItems = await CartItem.find({ user: userId }).populate("product");

    if (cartItems.length === 0) {
      return sendError(res, "Cart is empty", null, 400);
    }

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: userId,
      items: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await CartItem.deleteMany({ user: userId });

    sendSuccess(res, "Order created successfully", order, 201);
  } catch (error) {
    sendError(res, "Failed to create order", error, 500);
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort("-createdAt");
    sendSuccess(res, "Orders retrieved successfully", orders);
  } catch (error) {
    sendError(res, "Failed to retrieve orders", error, 500);
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.query.id).populate("items.product");

    if (!order) {
      return sendError(res, "Order not found", null, 404);
    }

    sendSuccess(res, "Order details retrieved successfully", order);
  } catch (error) {
    sendError(res, "Failed to retrieve order details", error, 500);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return sendError(res, "Order not found", null, 404);
    }

    sendSuccess(res, "Order status updated successfully", order);
  } catch (error) {
    sendError(res, "Failed to update order status", error, 500);
  }
};

module.exports = {
  createOrder,
  getOrderDetails,
  updateOrderStatus,
  getUserOrders,
};
