const STATUS = require("../config/statusEnum");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendSuccess, sendError } = require("../utils/responseService.js");
const Artist = require("../models/artistSchema.js");

const registerArtist = async (req, res) => {
  try {
    const {
      artistName,
      storeName,
      contactNumber,
      email,
      password,
      address,
      gstNumber,
      additionalInfo,
    } = req.body;

    const existingSeller = await Artist.findOne({ email });
    if (existingSeller) {
      return sendError(res, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = new Artist({
      artistName,
      storeName,
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

const loginArtist = async (req, res) => {
  try {
    const { email, password } = req.body;
    const artist = await Artist.findOne({ email });

    if (!artist) {
      return sendError(res, "Invalid login credentials");
    }

    if (artist.status !== STATUS.APPROVED) {
      return sendError(
        res,
        "Your account is pending approval from admin",
        null,
        403
      );
    }

    const isMatch = await bcrypt.compare(password, artist.password);
    if (!isMatch) {
      return sendError(res, "Invalid login credentials");
    }

    const token = jwt.sign(
      { _id: artist._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    sendSuccess(res, "Login successful", { artist, token });
  } catch (error) {
    sendError(res, "Login failed", error);
  }
};

const getArtistById = async (req, res) => {
  try {
    const { id } = req.query;

    const artist = await Artist.findById(id);

    if (!artist) {
      return sendError(res, "Artist not found", null, 404);
    }

    sendSuccess(res, "Artist profile retrieved successfully", artist);
  } catch (error) {
    sendError(res, "Failed to retrieve artist profile", error, 500);
  }
};

const updateArtistProfile = async (req, res) => {
  try {
    const { id } = req.query;
    const artist = await Artist.findById(id);

    if (!artist) {
      return sendError(res, "Artist not found", 404);
    }

    // Update with the request body
    Object.assign(artist, req.body);
    const updatedSeller = await artist.save();

    return sendSuccess(res, "Profile updated successfully", updatedSeller);
  } catch (error) {
    if (error.name === "CastError") {
      return sendError(res, "Invalid ID format");
    }
    return sendError(res, "Failed to update profile", error);
  }
};

module.exports = {
  registerArtist,
  loginArtist,
  getArtistById,
  updateArtistProfile,
};
