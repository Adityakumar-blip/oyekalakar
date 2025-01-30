// controllers/sellerController.js
const Seller = require("../models/sellerRequest.js");
const STATUS = require("../config/statusEnum");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendSuccess, sendError } = require("../utils/responseService.js");

// Register new seller request
const registerSeller = async (req, res) => {
  try {
    const {
      sellerName,
      shopName,
      contactNumber,
      email,
      password,
      address,
      gstNumber,
      additionalInfo,
    } = req.body;

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return sendError(res, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = new Seller({
      sellerName,
      shopName,
      contactNumber,
      email,
      password: hashedPassword,
      address,
      gstNumber,
      additionalInfo,
    });

    await seller.save();
    sendSuccess(
      res,
      "Seller registration request submitted successfully",
      seller,
      201
    );
  } catch (error) {
    sendError(res, "Failed to register seller", error);
  }
};

// Seller login
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return sendError(res, "Invalid login credentials");
    }

    if (seller.status !== STATUS.APPROVED) {
      return sendError(
        res,
        "Your account is pending approval from admin",
        null,
        403
      );
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return sendError(res, "Invalid login credentials");
    }

    const token = jwt.sign(
      { _id: seller._id.toString(), roles: seller.roles },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const newObj = seller.toObject();
    delete newObj.password;

    sendSuccess(res, "Login successful", { data: newObj, token });
  } catch (error) {
    sendError(res, "Login failed", error);
  }
};

// Get seller profile
const getSellerProfile = async (req, res) => {
  try {
    const { id } = req.query;

    const seller = await Seller.findById(id);

    if (!seller) {
      return sendError(res, "seller not found", null, 404);
    }

    const newSellerObj = seller.toObject();
    delete newSellerObj.password;

    sendSuccess(res, "seller profile retrieved successfully", newSellerObj);
  } catch (error) {
    sendError(res, "Failed to retrieve seller profile", error, 500);
  }
};

// Update seller profile
const updateSellerProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "sellerName",
    "shopName",
    "contactNumber",
    "address",
    "additionalInfo",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return sendError(res, "Invalid updates");
  }

  try {
    updates.forEach((update) => (req.seller[update] = req.body[update]));
    await req.seller.save();
    sendSuccess(res, "Profile updated successfully", req.seller);
  } catch (error) {
    sendError(res, "Failed to update profile", error);
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  getSellerProfile,
  updateSellerProfile,
};
