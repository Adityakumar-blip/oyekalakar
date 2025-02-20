const Workshop = require("../models/workshopSchema");
const { sendSuccess, sendError } = require("../utils/responseService");

exports.createWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.create(req.body);
    sendSuccess(res, "Workshop created successfully", workshop, 201);
  } catch (error) {
    sendError(res, "Failed to create workshop", error);
  }
};

exports.getWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find();
    sendSuccess(res, "Workshops fetched successfully", workshops);
  } catch (error) {
    sendError(res, "Failed to fetch workshops", error);
  }
};

exports.getWorkshopById = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return sendError(res, "Workshop not found", null, 404);
    sendSuccess(res, "Workshop fetched successfully", workshop);
  } catch (error) {
    sendError(res, "Failed to fetch workshop", error);
  }
};

exports.updateWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!workshop) return sendError(res, "Workshop not found", null, 404);
    sendSuccess(res, "Workshop updated successfully", workshop);
  } catch (error) {
    sendError(res, "Failed to update workshop", error);
  }
};

exports.deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) return sendError(res, "Workshop not found", null, 404);
    sendSuccess(res, "Workshop deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete workshop", error);
  }
};
