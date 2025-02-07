const Address = require("../models/addressSchema");
const { validatePincode } = require("../utils/validatePincode");

exports.addAddress = async (req, res) => {
  try {
    const { street, city, state, country, pin } = req.body;
    const userId = req.user.id; // Assuming user is authenticated

    // Validate Pincode
    const isValidPin = await validatePincode(country, pin);
    if (!isValidPin) {
      return sendError(res, "Invalid pincode", null, 400);
    }

    // Create address
    const newAddress = new Address({
      userId,
      street,
      city,
      state,
      country,
      pin,
    });
    const savedAddress = await newAddress.save();

    sendSuccess(res, "Address added successfully", savedAddress, 201);
  } catch (err) {
    console.error("Error adding address:", err);
    sendError(res, "Failed to add address", err, 500);
  }
};

exports.verifyPincode = async (req, res) => {
  try {
    const { country, pin } = req.body;
    const isValidPin = await validatePincode(country, pin);

    if (!isValidPin) {
      return sendError(res, "Invalid pincode", null, 400);
    }

    sendSuccess(res, "Valid pincode", { pin, country }, 200);
  } catch (err) {
    console.error("Error verifying pincode:", err);
    sendError(res, "Failed to verify pincode", err, 500);
  }
};
