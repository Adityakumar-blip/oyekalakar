const Address = require("../models/addressSchema");
const { sendError, sendSuccess } = require("../utils/responseService");
const { validatePincode } = require("../utils/validatePincode");

exports.addAddress = async (req, res) => {
  try {
    const { street, city, state, country, pincode, type } = req.body;
    const userId = req.user.id;

    // Validate Pincode
    const isValidPin = await validatePincode(country, pincode);
    if (!isValidPin) {
      return sendError(res, "Invalid pincode", null, 400);
    }

    // Check if address type already exists for the user
    const existingAddress = await Address.findOne({ userId, type });
    if (existingAddress) {
      return sendError(
        res,
        `You already have an address of type ${type}`,
        null,
        400
      );
    }

    // Create address
    const newAddress = new Address({
      userId,
      street,
      city,
      state,
      country,
      pincode,
      latitude: isValidPin?.places[0].latitude,
      longitude: isValidPin?.places[0].longitude,
      type: type,
    });
    const savedAddress = await newAddress.save();

    sendSuccess(res, "Address added successfully", savedAddress, 201);
  } catch (err) {
    console.error("Error adding address:", err);
    sendError(res, "Failed to add address", err, 500);
  }
};

exports.editAddress = async (req, res) => {
  try {
    const { street, city, state, country, pincode, type, addressId } = req.body;
    const userId = req.user.id;

    // Find the address
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return sendError(res, "Address not found", null, 404);
    }

    // Validate Pincode if changed
    if (pincode && pincode !== address.pincode) {
      const isValidPin = await validatePincode(
        country ? country : address.country,
        pincode
      );
      if (!isValidPin) {
        return sendError(res, "Invalid pincode", null, 400);
      }
      address.latitude = isValidPin?.places[0]?.latitude;
      address.longitude = isValidPin?.places[0]?.longitude;
    }

    if (type && type !== address.type) {
      const existingAddress = await Address.findOne({ userId, type });
      if (existingAddress) {
        return sendError(
          res,
          `You already have an address of type '${type}'`,
          null,
          400
        );
      }
    }

    // Update fields
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (country) address.country = country;
    if (pincode) address.pincode = pincode;
    if (type) address.type = type;

    await address.save();
    sendSuccess(res, "Address updated successfully", address, 200);
  } catch (err) {
    console.error("Error updating address:", err);
    sendError(res, "Failed to update address", err, 500);
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
