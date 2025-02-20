const Contest = require("../models/contestSchema");
const { sendSuccess, sendError } = require("../utils/responseService");

exports.createContest = async (req, res) => {
  try {
    const contest = await Contest.create(req.body);
    sendSuccess(res, "Contest created successfully", contest, 201);
  } catch (error) {
    sendError(res, "Failed to create contest", error);
  }
};

exports.getContests = async (req, res) => {
  try {
    const contests = await Contest.find();
    sendSuccess(res, "Contests fetched successfully", contests);
  } catch (error) {
    sendError(res, "Failed to fetch contests", error);
  }
};

exports.getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return sendError(res, "Contest not found", null, 404);
    sendSuccess(res, "Contest fetched successfully", contest);
  } catch (error) {
    sendError(res, "Failed to fetch contest", error);
  }
};

exports.updateContest = async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!contest) return sendError(res, "Contest not found", null, 404);
    sendSuccess(res, "Contest updated successfully", contest);
  } catch (error) {
    sendError(res, "Failed to update contest", error);
  }
};

exports.deleteContest = async (req, res) => {
  try {
    const contest = await Contest.findByIdAndDelete(req.params.id);
    if (!contest) return sendError(res, "Contest not found", null, 404);
    sendSuccess(res, "Contest deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete contest", error);
  }
};

exports.addParticipant = async (req, res) => {
  try {
    const { userId, submission } = req.body;
    const contest = await Contest.findById(req.params.id);

    if (!contest) return sendError(res, "Contest not found", null, 404);

    contest.participants.push({ userId, submission });
    await contest.save();

    sendSuccess(res, "Participant added successfully", contest);
  } catch (error) {
    sendError(res, "Failed to add participant", error);
  }
};

exports.declareWinners = async (req, res) => {
  try {
    const { winners } = req.body;
    const contest = await Contest.findById(req.params.id);

    if (!contest) return sendError(res, "Contest not found", null, 404);

    contest.winners = winners;
    contest.status = "Ended";
    await contest.save();

    sendSuccess(res, "Winners declared successfully", contest);
  } catch (error) {
    sendError(res, "Failed to declare winners", error);
  }
};
