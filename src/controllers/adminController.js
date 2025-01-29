const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminSchema");
const { sendSuccess, sendError } = require("../utils/responseService");
const Artist = require("../models/artistSchema");
const Sellers = require("../models/sellerRequest");
const Users = require("../models/userSchema");

exports.getAllArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find();
    sendSuccess(res, "artists retrieved successfully", artists);
  } catch (error) {
    sendError(res, "Failed to retrieve artists", error, 500);
  }
};

exports.updateArtist = async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const updateData = req.body;

    const updatedArtist = await Artist.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedArtist) {
      return sendError(res, "Artist not found", null, 404);
    }

    sendSuccess(res, "Artist updated successfully", updatedArtist);
  } catch (error) {
    sendError(res, "Failed to update artist", error, 500);
  }
};

exports.getAllSellers = async (req, res, next) => {
  try {
    const sellers = await Sellers.find();
    sendSuccess(res, "sellers retrieved successfully", sellers);
  } catch (error) {
    sendError(res, "Failed to retrieve sellers", error, 500);
  }
};

exports.updateSeller = async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const updateData = req.body;
    console.log("request", req.body);

    const updatedSeller = await Sellers.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSeller) {
      return sendError(res, "seller not found", null, 404);
    }

    sendSuccess(res, "seller updated successfully", updatedSeller);
  } catch (error) {
    sendError(res, "Failed to update seller", error, 500);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find();
    sendSuccess(res, "users retrieved successfully", users);
  } catch (error) {
    sendError(res, "Failed to retrieve users", error, 500);
  }
};
